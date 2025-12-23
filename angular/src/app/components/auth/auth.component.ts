import { Component, signal } from '@angular/core';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

@Component({
  selector: 'app-auth',
  imports: [LoginComponent, RegisterComponent],
  template: `
    @if (mode() === 'login') {
      <app-login (switchToRegister)="mode.set('register')" />
    }
    
    @if (mode() === 'register') {
      <app-register (switchToLogin)="mode.set('login')" />
    }
  `,
  styles: ``
})
export class AuthComponent {
  mode = signal<'login' | 'register'>('login');
}
