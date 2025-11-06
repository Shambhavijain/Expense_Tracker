import { Component, signal } from '@angular/core';

import { HeaderComponent } from "./shared/components/header/header";
import { DashboardComponent } from './dashboard/dashboard';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, DashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('expense-tracker');
}
