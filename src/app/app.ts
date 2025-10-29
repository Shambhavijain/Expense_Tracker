import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header";
import { DashboardComponent } from "./shared/components/dashboard/dashboard";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, DashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('expense-tracker');
}
