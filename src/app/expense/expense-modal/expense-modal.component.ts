import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {filter, from} from 'rxjs';
import { ActionSheetService } from '../../shared/service/action-sheet.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Category, Expense, FilterOption} from "../../shared/domain";
import {ExpenseService} from "../expense.service";
import {ToastService} from "../../shared/service/toast.service";
import {CategoryService} from "../../category/category.service";

@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html'
})
export class ExpenseModalComponent {
  expense: Expense = {} as Expense;
  readonly expenseForm: FormGroup;
  submitting = false;

  readonly FilterOptions: FilterOption[] = [
    { label: 'Mockup I', value: 'XXX' },
    { label: 'Mockup II', value: 'XXX' },
    { label: 'Mockup III', value: 'XXX' },
  ];

  constructor(
    private readonly actionSheetService: ActionSheetService,
    private readonly expenseService: ExpenseService,
    private readonly formBuilder: FormBuilder,
    private readonly modalCtrl: ModalController,
    private readonly toastService: ToastService
  ) {
    this.expenseForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
    });
  }

  save(): void {
    this.submitting = true;
    this.expenseService.upsertExpense(this.expenseForm.value).subscribe({
      next: () => {
        this.toastService.displaySuccessToast('Expense saved');
        this.modalCtrl.dismiss(null, 'refresh');
        this.submitting = false;
      },
      error: (error) => {
        this.toastService.displayErrorToast('Could not save expense', error);
        this.submitting = false;
      },
    });
  }
  cancel = (): void => {
    this.modalCtrl.dismiss(null, 'cancel');
  };

  delete(): void {
    from(this.actionSheetService.showDeletionConfirmation('Are you sure you want to delete this expense?'))
      .pipe(filter((action) => action === 'delete'))
      .subscribe({
        next: () => {
          this.modalCtrl.dismiss(null, 'delete');
        },
      });
  }
}

