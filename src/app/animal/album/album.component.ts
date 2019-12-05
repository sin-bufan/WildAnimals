import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'animal-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {
  //数据
  @Input() data:AlbumData;
  
  constructor() { }

  ngOnInit() { }

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