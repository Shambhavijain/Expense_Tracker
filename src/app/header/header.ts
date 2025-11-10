import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


import { Expense } from '../shared/models/expense';
import { ExpenseService } from '../shared/services/expense.service';
import { APP_CONSTANTS } from '../shared/constants/App_Constants';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    AutoCompleteModule,
    SelectModule,
    DialogModule,
    FloatLabelModule,
    ToastModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  providers: [MessageService]
})
export class HeaderComponent {
  constants = APP_CONSTANTS;
  constructor(private expenseService: ExpenseService, private messageService: MessageService) { }

  startDate: Date | null = null;
  endDate: Date | null = null;
  minEndDate: Date | null = null;
  selectedCategory: string | null = null;

  showAddExpenseDialog = false;
  expense: Expense = { id: '', description: '', amount: 0, category: '', date: new Date() };

  categories = [
    { label: 'All Categories', value: null },
    { label: 'Food', value: 'Food' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Bills', value: 'Bills' }
  ];

  applyFilter() {
    this.minEndDate = this.startDate;

    if (this.endDate && this.startDate && this.endDate < this.startDate) {
      this.endDate = this.startDate;
    }
    this.expenseService.setFilters({
      startDate: this.startDate,
      endDate: this.endDate,
      category: this.selectedCategory
    });
  }

  addExpense(form: NgForm) {
    if (!this.expense.description || !this.expense.amount || !this.expense.category || !this.expense.date) {
      return;
    }

    this.expenseService.addExpense({
      id: crypto.randomUUID(),
      description: this.expense.description,
      amount: this.expense.amount,
      category: this.expense.category,
      date: this.expense.date
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Expense Added',
      detail: 'Your expense has been successfully added!',
      life: 3000
    });

    if (form) {
      form.resetForm({
        description: '',
        amount: 0,
        category: '',
        date: new Date(),
        id: ''
      });
    }

    this.showAddExpenseDialog = false;

    this.applyFilter();
  }

  onCancel(form: NgForm) {

    if (form) {
      form.resetForm({
        description: '',
        amount: 0,
        category: '',
        date: new Date(),
        id: ''
      });
    }

    this.showAddExpenseDialog = false;

  }

  isFilterApplied(): boolean {
    return !!(this.startDate || this.endDate || this.selectedCategory);
  }


  resetFilters(): void {

    this.startDate = null;
    this.endDate = null;
    this.selectedCategory = null;

    this.expenseService.setFilters({
      startDate: this.startDate,
      endDate: this.endDate,
      category: this.selectedCategory
    });
    this.applyFilter();
  }
}
