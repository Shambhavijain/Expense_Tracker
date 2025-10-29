import { Injectable, signal, computed } from '@angular/core';
import { Expense } from '../models/expense';
import { ChartData } from 'chart.js';

@Injectable({ providedIn: 'root' })
export class ExpenseService {

expenses = signal<Expense[]>
(this.loadExpensesFromLocalStorage());
    filters = signal<{ startDate: Date | null; endDate: Date | null; category: string | null }>({
        startDate: null,
        endDate: null,
        category: null
    });


  addExpense(expense: Expense) {
  this.expenses.update(exp => {
    const updated = [...exp, expense];
    this.saveExpensesToLocalStorage(updated);
    return updated;
  });
}

    setFilters(filters: { startDate: Date | null; endDate: Date | null; category: string | null }) {
        this.filters.set(filters);
    }


    filteredExpenses = computed(() => {
        const { startDate, endDate, category } = this.filters();
        return this.expenses().filter(exp => {
            const dateMatch =
                (!startDate || exp.date >= startDate) &&
                (!endDate || exp.date <= endDate);
            const categoryMatch = !category || exp.category === category;
            return dateMatch && categoryMatch;
        });
    });

   
    categoryChartData = computed<ChartData<'pie'>>(() => {
        const data = this.filteredExpenses();
        const categoryTotals: Record<string, number> = {};
        data.forEach(e => categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount);

        return {
            labels: Object.keys(categoryTotals),
            datasets: [
                {
                    data: Object.values(categoryTotals),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                }
            ]
        };
    });

 
    monthlyChartData = computed<ChartData<'bar'>>(() => {
        const data = this.filteredExpenses();
        const monthlyTotals: Record<string, number> = {};
        data.forEach(e => {
            const month = new Date(e.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyTotals[month] = (monthlyTotals[month] || 0) + e.amount;
        });

        return {
            labels: Object.keys(monthlyTotals),
            datasets: [
                {
                    label: 'Monthly Expenses',
                    data: Object.values(monthlyTotals),
                    backgroundColor: '#42A5F5'
                }
            ]
        };
    });

    private loadExpensesFromLocalStorage(): Expense[] {
  const data = localStorage.getItem('expenses');
  return data ? JSON.parse(data) : [];
}

private saveExpensesToLocalStorage(expenses: Expense[]) {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

}