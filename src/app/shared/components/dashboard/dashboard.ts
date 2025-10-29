import { Component, computed, inject, Pipe, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CommonModule, NgFor } from '@angular/common';
import { ChartOptions } from 'chart.js';
import { APP_CONSTANTS } from '../../constants/constStr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, ChartModule, CommonModule, NgFor],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  constants =APP_CONSTANTS
  private expenseService = inject(ExpenseService);

 
  expenses = this.expenseService.expenses;
  filters = this.expenseService.filters;
  filteredExpenses = this.expenseService.filteredExpenses;


  activeTab = signal<'list' | 'analytics'>('list');

  totalExpense = computed(() => this.expenses().reduce((sum, e) => sum + e.amount, 0));
  averageExpense = computed(() => this.expenses().length ? this.totalExpense() / this.expenses().length : 0);
  topCategory = computed(() => {
    const data = this.expenses();
    if (!data.length) return 'N/A';
    const categoryCount: Record<string, number> = {};
    data.forEach(e => categoryCount[e.category] = (categoryCount[e.category] || 0) + e.amount);
    return Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0][0];
  });

categoryChartData = this.expenseService.categoryChartData;
monthlyChartData = this.expenseService.monthlyChartData;

chartOptions: ChartOptions = { 
responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', 
        labels: {
          boxWidth: 20,
          font: {
            size: 14
          }
        }
      }
    }
  };
  switchTab(tab: 'list' | 'analytics') {
    this.activeTab.set(tab);
  }

  
}
