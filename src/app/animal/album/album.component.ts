import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoComponent,Photo } from '../photo/photo.component';

@Component({
  selector: 'animal-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {
  //数据
  @Input() data:AlbumData;
  
  constructor(private modalController:ModalController) { }

  ngOnInit() { }
  
  async showPhoto(photo:any) {
    console.info(photo)
    const modal = await this.modalController.create({
      component: PhotoComponent,
      componentProps: {
        'data': photo
      }
    });
    return await modal.present();
  }
  
}
//相册数据
class AlbumData {
  bg:string="";
  name:string="";
  aliasName:string="";
  scientificName:string="";
  intro:string="";
  album:Array<Media>=[]
 }
 class Media{
   type:MediaType=MediaType.PHOTO;
   url:string;
   thumbnail:string;
 }
 export enum MediaType{
   "PHOTO","VIDEO"
 }