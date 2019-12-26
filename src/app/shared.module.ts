import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BgMusicComponent } from './bgmusic/bgmusic.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [BgMusicComponent],
  entryComponents: [BgMusicComponent],
  exports:[BgMusicComponent]
})
export class SharedModule { }
