
import { ChangeDetectorRef, Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

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


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule,
    ChartModule,
    CommonModule,
    NgFor,
    PaginatorModule,
    ButtonModule,
    ToastModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  providers: [MessageService]
})
export class DashboardComponent {

  constants = APP_CONSTANTS;

  private messageService = inject(MessageService)
  private expenseService = inject(ExpenseService);
  private cd = inject(ChangeDetectorRef);

  allExpenses = this.expenseService.allExpenses;
  activeFilters = this.expenseService.currentFilters;
  filteredExpenses = this.expenseService.filteredExpenses;

  filteredData = computed(() => {
    this.filteredExpenses();
  })
  activeTab = signal<'list' | 'analytics'>('list');


  totalExpenseAmount = computed(() =>
    this.allExpenses().reduce((sum, expense) => sum + expense.amount, 0)
  );

  averageExpenseAmount = computed(() =>
    this.allExpenses().length ? this.totalExpenseAmount() / this.allExpenses().length : 0
  );

  topSpendingCategory = computed(() => {
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
      detail: 'Your expense has been deleted added!',
      life: 3000
    });
  }

  currentPage: WritableSignal<number> = signal(0);
  rowsPerPage: WritableSignal<number> = signal(5);
  first: WritableSignal<number> = signal(0);

  paginatedExpenses = computed(() => {
    const startIndex = this.first();
    const endIndex = startIndex + this.rowsPerPage();
    return this.filteredExpenses().slice(startIndex, endIndex);
  });



  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rowsPerPage.set(event.rows ?? 5);
    this.currentPage.set(event.page ?? 0);
    this.cd.detectChanges();
  }



}
