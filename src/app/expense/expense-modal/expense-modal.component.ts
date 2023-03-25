import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {filter, from} from 'rxjs';
import { ActionSheetService } from '../../shared/service/action-sheet.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../shared/domain";
import {ExpenseService} from "../expense.service";
import {ToastService} from "../../shared/service/toast.service";
import {CategoryService} from "../../category/category.service";

@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html'
})
export class ExpenseModalComponent {
  category: Category = {} as Category;
  readonly categoryForm: FormGroup;
  submitting = false;

  constructor(
    private readonly actionSheetService: ActionSheetService,
    private readonly categoryService: CategoryService,
    private readonly formBuilder: FormBuilder,
    private readonly modalCtrl: ModalController,
    private readonly toastService: ToastService
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
    });
  }

  save(): void {
    this.submitting = true;
    this.categoryService.upsertCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.toastService.displaySuccessToast('Category saved');
        this.modalCtrl.dismiss(null, 'refresh');
        this.submitting = false;
      },
      error: (error) => {
        this.toastService.displayErrorToast('Could not save category', error);
        this.submitting = false;
      },
    });
  }
  cancel = (): void => {
    this.modalCtrl.dismiss(null, 'cancel');
  };

  delete(): void {
    from(this.actionSheetService.showDeletionConfirmation('Are you sure you want to delete this category?'))
      .pipe(filter((action) => action === 'delete'))
      .subscribe({
        next: () => {
          this.modalCtrl.dismiss(null, 'delete');
        },
      });
  }
}

