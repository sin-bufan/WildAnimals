import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'animal-keypoint',
  templateUrl: './keypoint.component.html',
  styleUrls: ['./keypoint.component.scss'],
})
export class KeypointComponent implements OnInit {
  //数据
  @Input()
  set data(data: KeypointData) {
    if (data != null) {

    }
  };

  constructor() { }

  ngOnInit() {}

}
class KeypointData{
  bg:string="";
  feathers:Array<Feather>=[]
}

class Feather {
  pointX:number=0;
  pointY:number=0;
  title:string="";
  text:string="";
  imageUrl:string="";
 }