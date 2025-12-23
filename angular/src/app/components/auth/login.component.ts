import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="auth-card">
      <h2 class="auth-title">Login</h2>

      @if (error()) {
        <p class="error-msg">{{ error() }}</p>
      }

      <form (ngSubmit)="handleSubmit()">
        <div class="auth-field">
          <label>Email:</label>
          <input
            [(ngModel)]="email"
            name="email"
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div class="auth-field">
          <label>Password:</label>
          <input
            [(ngModel)]="password"
            name="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" class="auth-btn">Login</button>
      </form>

      <div class="auth-switch">
        New user? <span (click)="switchToRegister.emit()">Create an account</span>
      </div>
    </div>
  `,
  styles: ``
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal('');
  
  switchToRegister = output<void>();

  constructor(private authService: AuthService) {}

  async handleSubmit(): Promise<void> {
    try {
      await this.authService.login(this.email, this.password);
    } catch (err: any) {
      this.error.set(err.message || 'Login failed');
    }
  }
}
