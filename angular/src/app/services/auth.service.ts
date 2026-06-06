import { Injectable, signal } from '@angular/core';
import { createAuthClient } from 'better-auth/client';

const authClient = createAuthClient({
  baseURL: 'http://localhost:5000',
});

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Better Auth handles session via cookies — signal tracks login state
  isAuthenticated = signal(false);

  async login(email: string, password: string): Promise<void> {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message || 'Login failed');
    this.isAuthenticated.set(true);
  }

  async register(email: string, password: string): Promise<void> {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split('@')[0],
    });
    if (error) throw new Error(error.message || 'Registration failed');
    this.isAuthenticated.set(true);
  }

  async logout(): Promise<void> {
    await authClient.signOut();
    this.isAuthenticated.set(false);
  }
}
