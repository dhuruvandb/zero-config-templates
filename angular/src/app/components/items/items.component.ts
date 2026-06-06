import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const API_BASE = 'http://localhost:5000';

interface Item {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-items',
  imports: [FormsModule],
  template: `
    <div>
      <div class="add-item-box">
        <input
          [(ngModel)]="newItem"
          name="newItem"
          placeholder="New item name"
        />
        <button class="add-item-btn" (click)="addItem()">Add</button>
      </div>

      <ul class="item-list">
        @for (item of items(); track item._id) {
          <li class="item">
            {{ item.name }}
            <button class="delete-btn" (click)="deleteItem(item._id)">Delete</button>
          </li>
        }
      </ul>
    </div>
  `,
  styles: ``
})
export class ItemsComponent implements OnInit {
  items = signal<Item[]>([]);
  newItem = '';

  async fetchItems(): Promise<void> {
    const res = await fetch(`${API_BASE}/api/items`, { credentials: 'include' });
    const data = await res.json();
    this.items.set(data);
  }

  ngOnInit(): void {
    this.fetchItems();
  }

  async addItem(): Promise<void> {
    if (!this.newItem.trim()) return;

    const res = await fetch(`${API_BASE}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: this.newItem }),
    });

    const created = await res.json();
    this.items.set([...this.items(), created]);
    this.newItem = '';
  }

  async deleteItem(id: string): Promise<void> {
    await fetch(`${API_BASE}/api/items/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    this.items.set(this.items().filter(i => i._id !== id));
  }
}
