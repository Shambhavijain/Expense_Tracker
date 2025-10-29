// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ButtonModule } from 'primeng/button';
// import { DatePickerModule } from 'primeng/datepicker';

// import { AutoCompleteModule } from 'primeng/autocomplete';
// import { SelectModule } from 'primeng/select';
// import { DialogModule } from 'primeng/dialog';
// import { Expense } from '../../models/expense';
// import { ExpenseService } from '../../services/expense.service';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ButtonModule, DatePickerModule, AutoCompleteModule, SelectModule, DialogModule],
//   templateUrl: './header.html',
//   styleUrls: ['./header.css']
// })
// export class HeaderComponent {
//   constructor(private expenseService: ExpenseService) {}
//   startDate: Date | null = null;
//   endDate: Date | null = null;
//   selectedCategory: string | null = null;
// showAddExpenseDialog = false;
// expense: Expense={ description: '', amount: 0, category: '', date: new Date() }
//   categories = [
//     { label: 'All Categories', value: null },
//     { label: 'Food', value: 'Food' },
//     { label: 'Travel', value: 'Travel' },
//     { label: 'Shopping', value: 'Shopping' },
//     { label: 'Bills', value: 'Bills' }
//   ];

  
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { Expense } from '../../models/expense';
import { ExpenseService } from '../../services/expense.service';
import { APP_CONSTANTS } from '../../constants/constStr';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DatePickerModule, AutoCompleteModule, SelectModule, DialogModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  constants= APP_CONSTANTS;
  constructor(private expenseService: ExpenseService) {}

  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedCategory: string | null = null;

  showAddExpenseDialog = false;
  expense: Expense = {  description: '', amount: 0, category: '', date: new Date() };

  categories = [
    { label: 'All Categories', value: null },
    { label: 'Food', value: 'Food' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Bills', value: 'Bills' }
  ];

  applyFilter() {
    this.expenseService.setFilters({
      startDate: this.startDate,
      endDate: this.endDate,
      category: this.selectedCategory
    });
  }

  addExpense() {
    if (!this.expense.description || !this.expense.amount || !this.expense.category || !this.expense.date) {
      return; 
    }

    this.expenseService.addExpense({
      description: this.expense.description,
      amount: this.expense.amount,
      category: this.expense.category,
      date: this.expense.date 
    });

    this.showAddExpenseDialog = false;
    this.expense = { description: '', amount: 0, category: '', date: new Date() };

    this.applyFilter(); 
  }
}

