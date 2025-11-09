import { Injectable, signal, computed } from '@angular/core';

import { ChartData } from 'chart.js';

import { Expense } from '../models/expense';
import { ExpenseFilter } from '../models/expense';
import { CHART_COLORS } from '../constants/App_Constants';
import { monthlyDatasetTemplate } from '../constants/Chart_Config';

@Injectable({ providedIn: 'root' })
export class ExpenseService {


    allExpenses = signal<Expense[]>(this.loadExpensesFromLocalStorage());

    currentFilters = signal<ExpenseFilter>({
        startDate: null,
        endDate: null,
        category: null
    });


    addExpense(newExpense: Expense): void {
        const expenseWithId: Expense = {
            ...newExpense,
            id: crypto.randomUUID()
        };

        this.allExpenses.update(existingExpenses => {
            const updatedExpenses = [...existingExpenses, expenseWithId];
            this.saveExpensesToLocalStorage(updatedExpenses);
            return updatedExpenses;
        });
    }

    deleteExpense(expenseId: string): void {
        this.allExpenses.update(existingExpenses => {
            const updatedExpenses = existingExpenses.filter(exp => exp.id !== expenseId);
            this.saveExpensesToLocalStorage(updatedExpenses);
            return updatedExpenses;
        });
    }

    setFilters(updatedFilters: ExpenseFilter): void {
        this.currentFilters.set(updatedFilters);
    }
    


    filteredExpenses = computed(() => {
        const { startDate, endDate, category } = this.currentFilters();

        const adjustedStartDate = startDate ? new Date(startDate) : null;
        const adjustedEndDate = endDate ? new Date(endDate) : null;

        if (adjustedEndDate) {
            adjustedEndDate.setHours(23, 59, 59, 999);
        }

        return this.allExpenses()
            .filter(expense => {
                const expenseDate = new Date(expense.date);

                const isDateInRange =
                    (!adjustedStartDate || expenseDate >= adjustedStartDate) &&
                    (!adjustedEndDate || expenseDate <= adjustedEndDate);

                const isCategoryMatch = !category || expense.category === category;

                return isDateInRange && isCategoryMatch;
            })
            .sort((exp1, exp2) => new Date(exp1.date).getTime() - new Date(exp2.date).getTime());
    });


    categoryChartData = computed<ChartData<'pie'>>(() => {
        const filteredData = this.filteredExpenses();
        const categoryTotals: Record<string, number> = {};

        filteredData.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        return {
            labels: Object.keys(categoryTotals),
            datasets: [
                {
                    data: Object.values(categoryTotals),
                    backgroundColor: CHART_COLORS
                }
            ]
        };
    });


    monthlyChartData = computed<ChartData<'bar'>>(() => {
        const filteredData = this.filteredExpenses();
        if (!filteredData.length) {
            return { labels: [], datasets: [] };
        }

        const monthlyTotals: Record<string, number> = {};
        filteredData.forEach(expense => {
            const monthLabel = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyTotals[monthLabel] = (monthlyTotals[monthLabel] || 0) + expense.amount;
        });

        const sortedLabels = Object.keys(monthlyTotals).sort((label1, label2) => {
            const [monthLabel1, yearLabel1] = label1.split(' ');
            const [monthLabel2, yearLabel2] = label2.split(' ');

            const dateForLabel1 = new Date(`${monthLabel1} 1, ${yearLabel1}`);
            const dateForLabel2 = new Date(`${monthLabel2} 1, ${yearLabel2}`);

            return dateForLabel1.getTime() - dateForLabel2.getTime();
        });
        const data = sortedLabels.map(label => monthlyTotals[label]);
        const dataset = { ...monthlyDatasetTemplate, data };
        return {
            labels: sortedLabels,
            datasets: [dataset]
        };
    });


    private loadExpensesFromLocalStorage(): Expense[] {
        const storedData = localStorage.getItem('expenses');
        return storedData ? JSON.parse(storedData) : [];
    }


    private saveExpensesToLocalStorage(expensesToSave: Expense[]): void {
        localStorage.setItem('expenses', JSON.stringify(expensesToSave));
    }
}
