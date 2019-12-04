import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AnimalPage } from './animal.page';
import { AlbumComponent } from './album/album.component';
import { KeypointComponent } from './keypoint/keypoint.component';
import { MapComponent } from './map/map.component';
import { TimelineComponent } from './timeline/timeline.component';
import { GameComponent } from './game/game.component';


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
  declarations: [AnimalPage,
  AlbumComponent,
  KeypointComponent,
  MapComponent,
  GameComponent,
  TimelineComponent]
})
export class AnimalPageModule {}
