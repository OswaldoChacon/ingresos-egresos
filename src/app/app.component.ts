import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ingresos-egresos';
  constructor(
    private authService: AuthService
  ) {
    this.authService.initOutListener()
  }
}
