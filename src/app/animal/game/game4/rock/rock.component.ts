import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { Animation } from '@ionic/core';
@Component({
  selector: 'game4-rock',
  templateUrl: './rock.component.html',
  styleUrls: ['./rock.component.scss'],
})
export class RockComponent implements OnInit {
  @Input() data: RockData;
  @ViewChild("rockImage") rockImage: ElementRef;
  constructor(private animationCtrl: AnimationController) { }

  ngOnInit() { }
  public async show(duration: number = 200) {
    let a: Animation = this.animationCtrl.create()
      .addElement(this.rockImage.nativeElement)
      .duration(duration)
      .iterations(1)
      .fromTo('opacity', "1", "0")
      .onFinish(() => {
      });
    await a.play();
  }
  public async hide(duration: number = 200) {
    let a: Animation = this.animationCtrl.create()
      .addElement(this.rockImage.nativeElement)
      .duration(duration)
      .iterations(1)
      .fromTo('opacity', "0", "1")
      .onFinish(() => {
      });
    await a.play();
  }
}

export class RockData {
  rockImageURL: string;
  fishImageURL: string;
  answer: boolean;
  x: number = 0;
  y: number = 0;
}