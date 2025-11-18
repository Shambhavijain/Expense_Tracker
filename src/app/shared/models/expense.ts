export type Expense = {
    id?: string;
    description: string;
    amount: number;
    category: string;
    date: Date;
}
export interface ExpenseFilter {
  startDate: Date | null;
  endDate: Date | null;
  category: string | null;
}

