// -------
// Expense
// -------

export interface Expense {
  // read-only
  id?: string;
  createdAt?: Date;
  lastModifiedAt?: Date;
  // editable
  amount: number;
  expense: Expense;
  date: Date;
  name: string;
}

export interface Category {
  id?: string;
  name: string;
}

export interface ExpenseCriteria extends PagingCriteria {
  name?: string;}

// ------
// Paging
// ------

export interface PagingCriteria {
  page: number;
  size: number;
  sort: string;
}

export interface Page<T> {
  content: T[];
  last: boolean;
  totalElements: number;
}

// ----
// Misc
// ----

export interface SortOption {
  label: string;
  value: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

// --------
// Category
// --------

export interface Category {
  id?: string;
  name: string;
}

export interface CategoryCriteria extends PagingCriteria {
  name?: string;
}
