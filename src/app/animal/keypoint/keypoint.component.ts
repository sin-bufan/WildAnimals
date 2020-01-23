import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'animal-keypoint',
  templateUrl: './keypoint.component.html',
  styleUrls: ['./keypoint.component.scss'],
})
export class KeypointComponent implements OnInit {
  //数据
  @Input() data: KeypointData;
  index:number=0;
  constructor() { }

  ngOnInit() {}
 onShow(i:number){
   //console.info(this.data.feathers[i].position)
   this.index=i;
 }
}

export class KeypointData{
  imageURL:string="";
  feathers:Array<Feather>=[]
}

class Feather {
  position:Position;
  title:string="";
  text:string="";
  imageURL:string="";
 }
 class Position{
   left:string;
   top:string;
 }