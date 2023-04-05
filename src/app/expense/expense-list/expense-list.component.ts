import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, debounce, from, interval, mergeMap, Subject, takeUntil} from 'rxjs';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';
import {InfiniteScrollCustomEvent, ModalController, RefresherCustomEvent} from '@ionic/angular';
import {Category, CategoryCriteria, Expense, FilterOption, SortOption} from '../../shared/domain';
import {ExpenseService} from "../expense.service";
import { ToastService } from '../../shared/service/toast.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CategoryService} from "../../category/category.service";
import{addMonths,set}from'date-fns';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  date = set(new Date(), { date: 1 });
  expenses: Expense[] | null = null;
  readonly initialSort = 'createdAt,desc';
  lastPageReached = false;
  loading = false;
  searchCriteria: CategoryCriteria = { page: 0, size: 25, sort: this.initialSort };
  readonly searchForm: FormGroup;
  readonly sortOptions: SortOption[] = [
    { label: 'Date (oldest first)', value: 'createdAt,asc' },
    { label: 'Date (newest first)', value: 'createdAt,desc' },
  ];
  readonly FilterOptions: FilterOption[] = [
    { label: 'Mockup I', value: 'XXX' },
    { label: 'Mockup II', value: 'XXX' },
    { label: 'Mockup III', value: 'XXX' },
  ];
  private readonly unsubscribe = new Subject<void>();

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly expenseService: ExpenseService,
    private readonly toastService: ToastService,
    private readonly formBuilder: FormBuilder
  ) {this.searchForm = this.formBuilder.group({ name: [], sort: [this.initialSort] });
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        debounce((value) => (value.name?.length ? interval(400) : interval(0)))
      )
      .subscribe((value) => {
        this.searchCriteria = { ...this.searchCriteria, ...value, page: 0 };
        this.loadExpenses();
      });
  }

  addMonths = (number: number): void => {
    this.date = addMonths(this.date, number);
  };

  private loadExpenses(next: () => void = () => {}): void {
    if (!this.searchCriteria.name) delete this.searchCriteria.name;
    this.loading = true;
    this.expenseService.getExpenses(this.searchCriteria).subscribe({
      next: (expenses) => {
        if (this.searchCriteria.page === 0 || !this.expenses) this.expenses = [];
        this.expenses.push(...expenses.content);
        this.lastPageReached = expenses.last;
        next();
        this.loading = false;
      },
      error: (error) => {
        this.toastService.displayErrorToast('Could not load expenses', error);
        this.loading = false;
      },
    });
  }
  ngOnInit(): void {
    this.loadExpenses();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async openModal(category?: Category): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ExpenseModalComponent,
      componentProps: { expense: this.expenses ? { ...category } : {} },
    });
    modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'refresh') this.reloadExpenses();
  }
  loadNextExpensesPage($event: any) {
    this.searchCriteria.page++;
    this.loadExpenses(() => ($event as InfiniteScrollCustomEvent).target.complete());
  }

  reloadExpenses($event?: any): void {
    this.searchCriteria.page = 0;
    this.loadExpenses(() => ($event ? ($event as RefresherCustomEvent).target.complete() : {}));
  }

}
