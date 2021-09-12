import { Component, OnInit, Output, EventEmitter, Input  } from '@angular/core';
import { MessageService } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import Dexie from "dexie";

@Component({
  selector: 'app-to-do-lists',
  templateUrl: './to-do-lists.component.html',
  styleUrls: ['./to-do-lists.component.scss'],
})
export class ToDoListsComponent implements OnInit {
  @Input() runTimer = false;
  @Output() playPomodoro = new EventEmitter()


  db: any;
  rows: Tarea[] = [];


  tareas: any = [];

  tarea = '';
  categoria = [];
  cat = [];
  tareaActive = 0;
  
  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService) {
    let a = JSON.parse(localStorage.getItem('tareas') + '');
    if (a) {
      this.tareas = a;
    }
  }

  ngOnInit(): void {
    this.makeDatabase();
    this.connectToDatabase();
    this.loadData()
    
  }

  makeDatabase(): void {
    this.db = new Dexie('Pomodoro');
    this.db.version(1).stores({
      Tareas: '++id, categoria, descripcion, pomodorosEstimados, pomodoros, horaInicio'
    });
    this.loadRows();
  }

  connectToDatabase(): void {
    this.db.open().catch((error:any) => {
      alert("Errod during connecting to database : " + error);
    }).finally((e:any) => {
      console.log(e);
      this.loadRows();
    });
  }

  loadRows(): void {
    this.db.Tareas.toArray((p:any) => this.rows = p);
    console.log(this.rows);
  }

  addRow(): void {
    this.db.Tareas.add({
      categoria: [this.cat + ''],
      descripcion: this.tarea,
      pomodorosEstimados: 1,
      pomodoros: 0,
      horaInicio: new Date(),
    }).then((e:any) => {
      console.log(e);
      console.log("ADD");
      this.loadRows();
    });
  }

  agregar() {
    this.addRow();
    if (this.tarea != '') {
      let t = {
        categoria: [this.cat + ''],
        descripcion: this.tarea,
        pomodorosEstimados: 1,
        pomodoros: 0,
        horaInicio: new Date(),
      };
      this.tareas.unshift(t);
      localStorage.setItem('tareas', JSON.stringify(this.tareas));
      this.messageService.add({
        severity: 'success',
        summary: 'Tarea agregada',
        detail: this.tarea,
      });
      (this.tarea = ''), (this.categoria = []);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Agregar titulo de la tarea'
      });
    }
  }


  
  loadData(){
   let n = 0;

   let x = setInterval( () => {
      this.db.Tareas.reverse().toArray((p:any) => this.tareas = p)
      console.log(this.tareas);
      n++;
      if(n == 3){
        clearInterval(x)
      }
    },1);
  }

  play(id:number){
    if(this.tareaActive == id){
      if(!this.runTimer){
        this.runTimer = true;
        this.playPomodoro.emit(id);
      }else{
        this.runTimer = false;
        this.playPomodoro.emit(0);
      }
    }
  else{
    if(!this.runTimer){
      this.tareaActive = id
      this.runTimer = true;
      this.playPomodoro.emit(id);
    }else{
      /* TODO SE ESTA EJECUTANDO UN POMODORO DE OTRA TAREA Y HAY QUE PAUSARLO E INICIAR OTRO */
      this.runTimer = false;
      this.tareaActive = id;
      this.playPomodoro.emit(0)
    }
  }
  }

  plusPomodoro(id:number, pomodoros:number){
    console.log(id);
    pomodoros += 1;
    this.db.Tareas.update(id, {"pomodorosEstimados": pomodoros})
    this.loadData()
  }

  delete(id:number, event: Event){
    this.confirmationService.confirm({
      target: event.target,
      message: "¿Esta seguro de eliminar la tarea?",
      icon: 'pi pi-explamation-triangle',
      accept: () => {
        this.db.Tareas.delete(id).then(()=>{
          this.messageService.add({
            severity: 'warn',
            summary: 'Tarea eliminada'
          });
          this.loadData()
        }).catch((e:any) =>{
          console.log(e);
          
        });
        
      },
      reject: (e:any) => {
        console.log(e);
        console.log("error");
        
      }
    })
    console.log(id);
    
  }


}

interface Tarea {
  id?: number,
  categoria: String,
  descripcion: String,
  pomodorosEstimados: number,
  pomodoros: number,
  horaInicio: Date,
}
