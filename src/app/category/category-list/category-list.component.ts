import { Component, OnInit } from '@angular/core';
import { from, mergeMap } from 'rxjs';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { ModalController } from '@ionic/angular';
import { Category } from '../../shared/domain';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  constructor(private readonly modalCtrl: ModalController) {}

  ngOnInit() {}

  async openModal(category?: Category): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: { category: category ? { ...category } : {} },
    });
    modal.present();
    const { role } = await modal.onWillDismiss();
    //if (role === 'refresh') this.reloadCategories();
  }
}
