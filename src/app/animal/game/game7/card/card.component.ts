import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { Animation } from '@ionic/core';
@Component({
  selector: 'game7-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() data: CardData;
  @ViewChild("frontImage") frontImage: ElementRef;
  @ViewChild("backImage") backImage: ElementRef;
  constructor(private animationCtrl: AnimationController) { }

  ngOnInit() { }
  public async show(duration: number = 200) {
    this.backImage.nativeElement.hidden = false;
    this.frontImage.nativeElement.hidden = true;
    let a: Animation = this.animationCtrl.create()
      .addElement(this.backImage.nativeElement)
      .duration(duration)
      .iterations(1)
      .fromTo('transform', "rotateY(0deg)", "rotateY(90deg)")
      .onFinish(() => {
      });
    await a.play();
    this.backImage.nativeElement.hidden = true;
    this.frontImage.nativeElement.hidden = false;
    let b: Animation = this.animationCtrl.create()
      .addElement(this.frontImage.nativeElement)
      .duration(duration)
      .iterations(1)
      .fromTo('transform', "rotateY(-90deg)", "rotateY(0deg)")
      .onFinish(() => {
      });
    await b.play();
  }
  public async hide(duration: number = 200) {
    this.frontImage.nativeElement.hidden = false;
    this.backImage.nativeElement.hidden = true;
    let a: Animation = this.animationCtrl.create()
      .addElement(this.frontImage.nativeElement)
      .duration(duration)
      .iterations(1)
      .fromTo('transform', "rotateY(0deg)", "rotateY(90deg)")
      .onFinish(() => {
      });
    await a.play();
    this.frontImage.nativeElement.hidden = true;
    this.backImage.nativeElement.hidden = false;
    let b: Animation = this.animationCtrl.create()
      .addElement(this.backImage.nativeElement)
      .duration(duration)
      .iterations(1)
      .fromTo('transform', "rotateY(-90deg)", "rotateY(0deg)")
      .onFinish(() => {
      });
    await b.play();
  }
}

export class CardData {
  frontImageURL: string;
  backImageURL: string;
  answer: boolean;
  x: number = 0;
  y: number = 0;
}