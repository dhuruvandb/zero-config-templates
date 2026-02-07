import { Injectable } from '@angular/core';

// Use globalThis for environment variable or fallback to localhost
const API_BASE = (globalThis as any).API_BASE_URL || 'http://localhost:5000';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  async post(path: string, body: any): Promise<any> {
    console.log('API POST Request to:', API_BASE + path, 'with body:', body);
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return res.json();
  }

  async authGet(path: string, token: string): Promise<any> {
    const res = await fetch(API_BASE + path, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }

  async authPost(path: string, token: string, body: any): Promise<any> {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async authDelete(path: string, token: string): Promise<any> {
    const res = await fetch(API_BASE + path, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }
}
