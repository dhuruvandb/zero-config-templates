import { Component, signal } from '@angular/core';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ForgotPasswordComponent } from './forgot-password.component';

@Component({
  selector: 'app-auth',
  imports: [LoginComponent, RegisterComponent, ForgotPasswordComponent],
  template: `
    @if (mode() === 'login') {
      <app-login (switchToRegister)="mode.set('register')" (switchToForgotPassword)="mode.set('forgot-password')" />
    }
    
    @if (mode() === 'register') {
      <app-register (switchToLogin)="mode.set('login')" />
    }

    @if (mode() === 'forgot-password') {
      <app-forgot-password (switchToLogin)="mode.set('login')" />
    }
  `,
  styles: ``
})
export class AuthComponent {
  mode = signal<'login' | 'register' | 'forgot-password'>('login');
}
