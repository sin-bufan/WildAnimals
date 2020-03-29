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
import { CultureComponent } from './culture/culture.component';
import { PhotoComponent } from './photo/photo.component';
import { VideoComponent } from './video/video.component';
import { Game1Component } from './game/game1/game1.component';
import { Game2Component } from './game/game2/game2.component';
import { Game3Component } from './game/game3/game3.component';
import { Game4Component } from './game/game4/game4.component';
import { Game5Component } from './game/game5/game5.component';
import { Game6Component } from './game/game6/game6.component';
import { Game7Component } from './game/game7/game7.component';
import { Game8Component } from './game/game8/game8.component';
import { Game9Component } from './game/game9/game9.component';
import { Game10Component } from './game/game10/game10.component';
import { GameDirective } from './game/game.directive';
import { GibbonComponent } from './game/game1/gibbon/gibbon.component';
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
    CultureComponent,
    TimelineComponent,
    GameDirective,
    Game1Component,
    Game2Component,
    Game3Component,
    Game4Component,
    Game5Component,
    Game6Component,
    Game7Component,
    Game8Component,
    Game9Component,
    Game10Component,
    GibbonComponent
  ],
  entryComponents: [
    PhotoComponent,
    VideoComponent,
    Game1Component,
    Game2Component,
    Game3Component,
    Game4Component,
    Game5Component,
    Game6Component,
    Game7Component,
    Game8Component,
    Game9Component,
    Game10Component,
    GibbonComponent
  ]
})
export class AnimalPageModule { }
