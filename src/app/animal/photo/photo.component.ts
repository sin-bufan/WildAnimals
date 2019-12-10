import { Component, OnInit, Input } from '@angular/core';
import { NavParams,ModalController } from '@ionic/angular';

@Component({
  selector: 'animal-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent {
  @Input() data: Photo;
  constructor(private modalCtrl:ModalController,
    private navParams:NavParams) { 
    console.log(navParams.get('data'));
  }
  onClose(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
export class Photo{
  type:string;
  url:string;
  text:string;
}
