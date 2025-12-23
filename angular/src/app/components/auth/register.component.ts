import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  template: `
    <div class="auth-card">
      <h2 class="auth-title">Register</h2>

      @if (error()) {
        @if (errorArray()) {
          <ul class="error-msg">
            @for (msg of errorArray(); track msg) {
              <li>{{ msg }}</li>
            }
          </ul>
        } @else {
          <p class="error-msg">{{ error() }}</p>
        }
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
            placeholder="Create a strong password"
          />
        </div>

        <button type="submit" class="auth-btn">Register</button>
      </form>

      <div class="auth-switch">
        Already have an account? <span (click)="switchToLogin.emit()">Login here</span>
      </div>
    </div>
  `,
  styles: ``
})
export class RegisterComponent {
  email = '';
  password = '';
  error = signal<string>('');
  errorArray = signal<string[] | null>(null);
  
  switchToLogin = output<void>();

  constructor(private authService: AuthService) {}

  async handleSubmit(): Promise<void> {
    this.error.set('');
    this.errorArray.set(null);
    
    try {
      const result = await this.authService.register(this.email, this.password);
      
      if (result.accessToken) {
        this.switchToLogin.emit();
      }
    } catch (err: any) {
      // Backend may return: { errors: [...] } or { message: "..." }
      if (err?.response?.data?.errors) {
        this.errorArray.set(err.response.data.errors.map((e: any) => e.msg));
      } else {
        this.error.set(err?.response?.data?.message || err.message || 'Registration failed');
      }
    }
  }
}
