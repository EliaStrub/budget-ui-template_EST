import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {filter, from} from 'rxjs';
import { ActionSheetService } from '../../shared/service/action-sheet.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
})
export class CategoryModalComponent {
  isCreate!: boolean;

  constructor(private readonly actionSheetService: ActionSheetService, private readonly modalCtrl: ModalController) {}

  cancel = (): void => {
    this.modalCtrl.dismiss(null, 'cancel');
  };

  save = (): void => {
    this.modalCtrl.dismiss(null, 'confirm');
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
