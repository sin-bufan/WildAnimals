import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'animal-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent {
  @Input() data: Photo;
  constructor(private modalCtrl:ModalController) { 
  }
  onClose(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
export class Photo{
  imageURL:string;
  thumbURL:string;
  text:string;
}
