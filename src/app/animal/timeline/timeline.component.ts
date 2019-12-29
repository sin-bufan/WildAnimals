import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoComponent,Photo } from '../photo/photo.component';

@Component({
  selector: 'animal-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  //数据
  @Input() data: TimelineData;
  
  constructor(private modalController:ModalController) { }

  ngOnInit() { }
  //显示照片
  async showPhoto(photo:any) {
    //console.info(photo)
    const modal = await this.modalController.create({
      component: PhotoComponent,
      cssClass: 'photo-modal',
      componentProps: {
        'data': photo
      }
    });
    return await modal.present();
  }
}

class TimelineData {
  album: Array<Photo> = [];
  timeline: Array<TimelineNode> = [];
}
class TimelineNode {
  time: Date;
  text: string;
}
