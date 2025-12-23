import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './components/auth/auth.component';
import { ItemsComponent } from './components/items/items.component';

@Component({
  selector: 'app-root',
  imports: [AuthComponent, ItemsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public authService: AuthService) {}
}
