import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';//ion-phaser使用
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AnimalPage } from './animal.page';
import {MapComponent} from './map/map.component';
import {GameComponent} from './game/game.component';


const routes: Routes = [
  {
    path: '',
    component: AnimalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AnimalPage,MapComponent,GameComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]//ion-phaser使用
})
export class AnimalPageModule {}
