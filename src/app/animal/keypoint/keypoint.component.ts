import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { AnimalsDataService } from 'src/app/animals-data.service';

@Component({
  selector: 'animal-keypoint',
  templateUrl: './keypoint.component.html',
  styleUrls: ['./keypoint.component.scss'],
})
export class KeypointComponent implements OnInit {
  //数据
  @Input() data: KeypointData;
  index: number = -1;

  @ViewChild("featherAnimal", { static: false }) feather_animal: ElementRef;
  @ViewChild("featherInfo", { static: false }) feather_info: ElementRef;
  constructor(private animationCtrl: AnimationController, 
    public animalsDataService: AnimalsDataService) {
  }

  ngOnInit() { }
  async onShow(i: number) {
    //console.info(this.data.feathers[i].position, this.feather_info)
    if (this.index < 0) {
      //第一次
      this.index = i;
      const b = this.animationCtrl.create()
        .addElement(this.feather_animal.nativeElement)
        .duration(500)
        .iterations(1)
        .fromTo('transform', 'translate(-50%,-50%)', 'translate(-10%,-50%)');
      await b.play()
      this.feather_info.nativeElement.hidden = false;
    } else {
      const a = this.animationCtrl.create()
        .addElement(this.feather_info.nativeElement)
        .duration(300)
        .iterations(1)
        .fromTo('transform', 'translate(-100%,-50%)', 'translate(-50%,-50%)')
        .fromTo('opacity', '1', '0');
      await a.play()
      this.index = i;
    }
    //信息板出场动画
    const a = this.animationCtrl.create()
      .addElement(this.feather_info.nativeElement)
      .duration(800)
      .iterations(1)
      .fromTo('transform', 'translate(-50%,-50%)', 'translate(-120%,-50%)')
      .fromTo('opacity', '0', '1')
      .easing("ease-out");
    await a.play()
  }
}

export class KeypointData {
  imageURL: string = "";
  feathers: Array<Feather> = []
}

class Feather {
  position: Position;
  title: string = "";
  text: string = "";
  imageURL: string = "";
}
class Position {
  left: string;
  top: string;
}