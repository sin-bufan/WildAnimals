import { Component, OnInit } from '@angular/core';
import {Howl, Howler} from 'howler';
@Component({
  selector: 'app-bgmusic',
  templateUrl: './bgmusic.component.html',
  styleUrls: ['./bgmusic.component.scss'],
})
export class BgMusicComponent implements OnInit {
  static sound = new Howl({
    src: ['assets/bgMusic/1.mp3', 'assets/bgMusic/2.mp3', 'assets/bgMusic/3.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.5,
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