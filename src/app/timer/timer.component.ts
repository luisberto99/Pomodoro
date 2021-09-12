import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  @Input() tareaActiva = 0
  @Input () runTimer = false;
  @Output() run = new EventEmitter;
  
  
  breakLength = 5;
  sessionLegth = 25 * 30;
  timeLeft = this.sessionLegth;
  fillHeigth = '0%';
  time = this.secondsToHms(this.sessionLegth);
  configuracion:any = {};


  constructor() {
    
  }
  
  ngOnInit(): void {
    this.configuracion = JSON.parse(localStorage.getItem('pomodoro') + '')
    this.timeLeft = this.configuracion.sessionLegth
    this.sessionLegth = this.configuracion.sessionLegth
    this.breakLength = this.configuracion.breakLength
    this. time = this.secondsToHms(this.sessionLegth)
  }

  x = setInterval(() => {
    if (this.timeLeft > 0) {
      if (this.runTimer) {
        this.timeLeft -= 1;
        this.fillHeigth = 100 - (this.timeLeft / this.sessionLegth) * 100 + '%';
        console.log(this.fillHeigth);
        this.time = this.secondsToHms(this.timeLeft);
      } else {
        console.log('parado');
      }
    } else {
      this.runTimer = false;
    }
  }, 1000);

  secondsToHms(t: number) {
    let h = Math.floor(t / 3600);
    let m = Math.floor((t % 3600) / 60);
    let s = Math.floor((t % 3600) % 60);
    return (
      (h > 0 ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s
    );
  }

  control() {
    this.runTimer = !this.runTimer;
    this.run.emit(this.runTimer);
  }

  reset(){
    this.runTimer = false
    this.timeLeft = this.sessionLegth;
    this.time = this.secondsToHms(this.sessionLegth);
    this.fillHeigth = '0%';
  }
}
