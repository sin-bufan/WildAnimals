import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'animal-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  @Input() data: Video;
  constructor(private modalCtrl: ModalController) {

  }

  ngOnInit() { }

  onClose() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
export class Video {
  videoURL:string;
  thumbURL:string;
  thumbnail: string;
}