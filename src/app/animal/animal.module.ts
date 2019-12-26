import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {SharedModule} from '../shared.module';

import { AnimalPage } from './animal.page';
import { AlbumComponent } from './album/album.component';
import { KeypointComponent } from './keypoint/keypoint.component';
import { MapComponent } from './map/map.component';
import { TimelineComponent } from './timeline/timeline.component';
import { GameComponent } from './game/game.component';
import { PhotoComponent } from './photo/photo.component';
import { VideoComponent } from './video/video.component';
const routes: Routes = [
  {
    path: '',
    component: AnimalPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AnimalPage,
    AlbumComponent,
    PhotoComponent,
    VideoComponent,
    KeypointComponent,
    MapComponent,
    GameComponent,
    TimelineComponent
  ],
  entryComponents: [
    PhotoComponent,
    VideoComponent
  ]
})
export class AnimalPageModule { }
