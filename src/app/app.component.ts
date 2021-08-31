import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pomodoro';
  configuracion = {
    sessionLegth: 25 * 60,
    breakLength: 5 * 60,
    longBreakLength: 15 * 60,
    autoStart: false,
    breakStart: false
  }

  ngOnInit(): void {
    if(localStorage.getItem('pomodoro') == null){
      localStorage.setItem('pomodoro', JSON.stringify(this.configuracion))
    }else{
      this.configuracion = JSON.parse(localStorage.getItem('pomodoro') + '')
    }
  }
}
