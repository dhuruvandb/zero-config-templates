import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessToken = signal<string | null>(null);

  constructor(private apiService: ApiService) {
    // Load token from localStorage on init
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.accessToken.set(storedToken);
    }
  }

  async login(email: string, password: string): Promise<void> {
    const res = await this.apiService.post('/api/auth/login', { email, password });

    if (!res.accessToken) {
      throw new Error(res.message || 'Login failed');
    }

    this.accessToken.set(res.accessToken);
    localStorage.setItem('token', res.accessToken);
  }

  async register(email: string, password: string): Promise<any> {
    const res = await this.apiService.post('/api/auth/register', { email, password });

    if (!res.accessToken) {
      throw new Error(res.message || 'Registration failed');
    }

    return res;
  }

  logout(): void {
    this.accessToken.set(null);
    localStorage.removeItem('token');
  }
}
