import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoComponent ,Photo} from '../photo/photo.component';
import { VideoComponent ,Video} from '../video/video.component';
import { AnimalsDataService } from 'src/app/animals-data.service';
@Component({
  selector: 'animal-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {
  //数据
  @Input() data:AlbumData;
  
  constructor(private modalController: ModalController,
    public animalsDataService: AnimalsDataService
  ) {
  }
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
  async showVideo(video:any) {
    //console.info(video)
    const modal = await this.modalController.create({
      component: VideoComponent,
      cssClass: 'photo-modal',
      componentProps: {
        'data': video
      }
    });
    return await modal.present();
  }
}
//相册数据
export class AlbumData {
  name:string="";
  aliasName:string="";
  scientificName:string="";
  intro:string="";
  imageURL:string="";
  album:Array<Photo>=[];
  video:Video;
 }