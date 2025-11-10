
import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule} from '@angular/common';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ChartOptions } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ExpenseService } from '../shared/services/expense.service';
import { APP_CONSTANTS } from '../shared/constants/App_Constants';
import { defaultChartOptions } from '../shared/constants/Chart_Config';
import { Expense, ExpenseFilter } from '../shared/models/expense';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule,
    ChartModule,
    CommonModule,
    PaginatorModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  providers: [MessageService]
})
export class DashboardComponent {

  constants = APP_CONSTANTS;

  private messageService = inject(MessageService)
  private expenseService = inject(ExpenseService);
 
  allExpenses: WritableSignal<Expense[]> = this.expenseService.allExpenses;
  activeFilters: WritableSignal<ExpenseFilter> = this.expenseService.currentFilters;
  filteredExpenses: Signal<Expense[]> = this.expenseService.filteredExpenses;

 
  activeTab = signal<'list' | 'analytics'>('list');


  totalExpenseAmount: Signal<number> = computed(() =>
    this.allExpenses().reduce((sum, expense) => sum + expense.amount, 0)
  );

  averageExpenseAmount: Signal<number> = computed(() =>
    this.allExpenses().length ? this.totalExpenseAmount() / this.allExpenses().length : 0
  );

  topSpendingCategory: Signal<string> = computed(() => {
    const expenses = this.allExpenses();
    if (!expenses.length) return 'N/A';

    const categoryTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).sort((exp1, exp2) => exp2[1] - exp1[1])[0][0];
  });

  categoryChartData = this.expenseService.categoryChartData;
  monthlyChartData = this.expenseService.monthlyChartData;

  chartOptions: ChartOptions = defaultChartOptions;

  switchTab(tab: 'list' | 'analytics') {
    this.activeTab.set(tab);
  }

  onDeleteExpense(id: string): void {
    this.expenseService.deleteExpense(id);
    this.messageService.add({
      severity: 'success',
      summary: 'Expense Added',
      detail: 'Your expense has been deleted successfully!',
      life: 3000
    });
  }

  currentPage: WritableSignal<number> = signal(0);
  rowsPerPage: WritableSignal<number> = signal(5);
  pageStartIndex: WritableSignal<number> = signal(0);

  paginatedExpenses: Signal<Expense[]> = computed(() => {
    const startIndex = this.pageStartIndex();
    const endIndex = startIndex + this.rowsPerPage();
    return this.filteredExpenses().slice(startIndex, endIndex);
  });

  onPageChange(event: PaginatorState): void {
    this.pageStartIndex.set(event.first ?? 0);
    this.rowsPerPage.set(event.rows ?? 5);
    this.currentPage.set(event.page ?? 0);
    
  }
}
