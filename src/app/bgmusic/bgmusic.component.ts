import { Component, OnInit } from '@angular/core';
import {Howl, Howler} from 'howler';
@Component({
  selector: 'app-bgmusic',
  templateUrl: './bgmusic.component.html',
  styleUrls: ['./bgmusic.component.scss'],
})
export class BgMusicComponent implements OnInit {
  static sound = new Howl({
    src: ['assets/sound/bgMusic/1.mp3'],
    autoplay: true,
    loop: true,
    // volume: 0.5,
    volume: 1,
    onend: function() {
      //console.log('Finished!');
    }
  });
  constructor() {

   }

  ngOnInit() {}
  get muted():boolean{
    return BgMusicComponent.sound._muted;
  }
  onMute(){
    //console.info('切换静音：',BgMusicComponent.sound)
    if (this.muted){
      BgMusicComponent.sound.mute(false);
    }else{
      BgMusicComponent.sound.mute(true);
    }
  }
}
