import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'animal-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent {
  @Input() data: Photo;
  constructor(private navParams:NavParams) { 
    console.log(navParams.get('data'));
  }
}
export class Photo{
  type:string;
  url:string;
  text:string;
}
