import { Injectable } from '@angular/core';

const API_BASE = 'http://localhost:5000';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  async post(path: string, body: any): Promise<any> {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    return res.json();
  }
}
