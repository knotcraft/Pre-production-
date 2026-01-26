export interface Category {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

export interface BudgetData {
  total?: number;
  categories?: Record<string, Omit<Category, 'id'>>;
}
