import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { authClient } from '../../../lib/auth-client';

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

        <button type="submit" class="auth-btn" [disabled]="loading()">
          {{ loading() ? 'Signing in...' : 'Login' }}
        </button>
      </form>

      <div class="auth-social">
        <p class="auth-or">Or continue with</p>
        <div class="auth-social-buttons">
          <button type="button" class="auth-btn auth-social-btn"
            [disabled]="socialLoading() === 'google'"
            (click)="handleSocialLogin('google')">
            {{ socialLoading() === 'google' ? 'Redirecting...' : 'Google' }}
          </button>
          <button type="button" class="auth-btn auth-social-btn"
            [disabled]="socialLoading() === 'github'"
            (click)="handleSocialLogin('github')">
            {{ socialLoading() === 'github' ? 'Redirecting...' : 'GitHub' }}
          </button>
        </div>
      </div>

      <div class="auth-switch">
        <span (click)="switchToForgotPassword.emit()">Forgot password?</span>
      </div>

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
  loading = signal(false);

  switchToRegister = output<void>();
  switchToForgotPassword = output<void>();

  constructor(private authService: AuthService) { }

  async handleSubmit(): Promise<void> {
    this.error.set('');
    this.loading.set(true);
    try {
      await this.authService.login(this.email, this.password);
    } catch (err: any) {
      this.error.set(err.message || 'Login failed');
    } finally {
      this.loading.set(false);
    }
  }

  async handleSocialLogin(provider: 'google' | 'github'): Promise<void> {
    this.socialLoading.set(provider);
    try {
      await authClient.signIn.social({ provider, callbackURL: '/' });
    } catch (err: any) {
      this.error.set(err.message || `${provider} login failed`);
      this.socialLoading.set(null);
    }
  }

  socialLoading = signal<string | null>(null);
}
