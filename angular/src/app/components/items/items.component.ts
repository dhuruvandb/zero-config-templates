import { Component, OnInit, signal, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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
  accessToken = input.required<string>();
  items = signal<Item[]>([]);
  newItem = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchItems();
  }

  async fetchItems(): Promise<void> {
    const data = await this.apiService.authGet('/api/items', this.accessToken());
    this.items.set(data);
  }

  async addItem(): Promise<void> {
    if (!this.newItem.trim()) return;

    const created = await this.apiService.authPost(
      '/api/items',
      this.accessToken(),
      { name: this.newItem }
    );

    this.items.set([...this.items(), created]);
    this.newItem = '';
  }

  async deleteItem(id: string): Promise<void> {
    await this.apiService.authDelete(`/api/items/${id}`, this.accessToken());
    this.items.set(this.items().filter(i => i._id !== id));
  }
}
