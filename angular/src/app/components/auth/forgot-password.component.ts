import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { authClient } from '../../../lib/auth-client';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  template: `
    @if (success()) {
      <div class="auth-card" style="text-align: center">
        <h2 class="auth-title">Check your email</h2>
        <p class="error-msg">
          If an account exists for {{ email }}, you will receive a password reset link shortly.
        </p>
        <div class="auth-switch">
          <span (click)="switchToLogin.emit()">Back to Sign In</span>
        </div>
      </div>
    } @else {
      <div class="auth-card">
        <h2 class="auth-title">Reset your password</h2>

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

          <button type="submit" class="auth-btn" [disabled]="loading()">
            {{ loading() ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <div class="auth-switch">
          Remember your password? <span (click)="switchToLogin.emit()">Back to Sign In</span>
        </div>
      </div>
    }
  `,
  styles: ``
})
export class ForgotPasswordComponent {
  email = '';
  error = signal('');
  loading = signal(false);
  success = signal(false);

  switchToLogin = output<void>();

  async handleSubmit(): Promise<void> {
    this.error.set('');
    this.loading.set(true);
    try {
      const { error: err } = await authClient.requestPasswordReset({
        email: this.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) throw new Error(err.message || 'Failed to send reset email');
      this.success.set(true);
    } catch (err: any) {
      this.error.set(err.message || 'Something went wrong');
    } finally {
      this.loading.set(false);
    }
  }
}
