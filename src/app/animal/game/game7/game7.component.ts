import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { GameComponent, GameData, GAME_STATE, RIGHT_SOUND, WRONG_SOUND } from '../game.component';
import { AnimationController, IonSlides, ModalController } from '@ionic/angular';
import { Animation } from '@ionic/core';

import { shuffle } from 'lodash';
import { CardComponent, CardData } from './card/card.component';
import { GameCompleteComponent } from '../gameComplete/gameComplete.component';
import { AnimalsDataService } from 'src/app/animals-data.service';
const CARD_START_X: number = 200;
const CARD_START_Y: number = -300;
const CARD_H_GAP: number = 200;
const CARD_V_GAP: number = 200;
const CARD_COLUMN_NUM: number = 3;
const SHUFFLE_NUM: number = 3;
@Component({
  selector: 'app-game7',
  templateUrl: './game7.component.html',
  styleUrls: ['./game7.component.scss'],
})
export class Game7Component implements AfterViewInit, GameComponent {
  //数据
  _data: Game7Data;
  @Input()
  set data(value: Game7Data) {
    if (value != null && value.type != null) {
      this._data = value;
      this.initGame();
      if (!this._data.startDialog) {
        this.startGameHandler();
      }
    }
  };
  get data(): Game7Data {
    return this._data;
  }
  @ViewChildren("card", { read: ElementRef }) cardsElementRef: QueryList<ElementRef>;
  @ViewChildren("card") cards: QueryList<CardComponent>;
  lang: string;
  constructor(private animationCtrl: AnimationController,
    private cdRef: ChangeDetectorRef,
    private modalController: ModalController,
    private animalsDataService: AnimalsDataService) {
    this.lang = this.animalsDataService.language;
  }
  ngAfterViewInit() {
    // this.initGame();
  }
  /********************************************************************************************************************/
  gameState: string = GAME_STATE.READY;
  //初始化游戏，不能放到set data里面，因为phaser-div-game5可能还没生成
  initGame() {
    //初始化游戏
    this.cardsPositionIndex = new Array();
    for (let i: number = 0; i < this.data.gameContents.items.length; i++) {
      this.cardsPositionIndex.push(i);
    }
    //离开游戏的时候重置
    let this_ = this;
    this.animalsDataService.$currentAnimalSection.subscribe(
      (value) => {
        //console.info("获取导航事件：",value);
        this_.resetGame();
      }
    );
    this.resetGame()
  }
  //重置游戏场景
  resetGame() {
    this.gameState = GAME_STATE.READY;
  }
  //开始游戏
  startGameHandler() {
    this.gameState = GAME_STATE.PLAYING;
    this.showGame()
  }
  async endGame() {
    this.gameState = GAME_STATE.COMPLETED;
    console.info({ imageURL: this.data.gameCompleteImageURL, text: this.data.gameCompleteTips })
    const modal = await this.modalController.create({
      component: GameCompleteComponent,
      cssClass: 'photo-modal',
      componentProps: {
        'data': { imageURL: this.data.gameCompleteImageURL, text: this.data.gameCompleteTips }
      }
    });
    await modal.present();
    this.resetGame();
  }
  cardsPositionIndex: Array<number> = new Array();
  async showGame() {
    //初始化牌面位置
    this.cardsPositionIndex = shuffle(this.cardsPositionIndex);
    this.cardsElementRef.forEach((item, index, array) => {
      this.data.gameContents.items[index].x = CARD_START_X;
      this.data.gameContents.items[index].y = CARD_START_Y;
      item.nativeElement.style.left = CARD_START_X + "px";
      item.nativeElement.style.top = CARD_START_Y + "px";
    })
    //发牌
    await this.arrangeCards(300, 100);
    //显示牌面
    this.cards.forEach((item) => {
      item.show();
    })
    //等3秒
    await this.countDown(3)
    //隐藏牌面
    for (let i: number = 0; i < this.cardsPositionIndex.length; i++) {
      let card: CardComponent = this.cards.toArray()[i] as CardComponent;
      await card.hide(100);
    }
    //洗牌
    for (let i = 0; i < SHUFFLE_NUM; i++) {
      this.cardsPositionIndex = shuffle(this.cardsPositionIndex);
      await this.arrangeCards();
    }

    this.enable = true;
  }
  //移动位置动画
  async arrangeCards(duration: number = 1000, delayOffset: number = 0) {
    //新确定坐标
    let a: Array<Animation> = new Array(this.cardsPositionIndex.length);
    for (let i: number = 0; i < this.cardsPositionIndex.length; i++) {
      //记录一下之前的位置
      let oldCardX, oldCardY: number
      oldCardX = this.data.gameContents.items[i].x;
      oldCardY = this.data.gameContents.items[i].y;
      // if (this.data.gameContents.items[i].x) {
      //   oldCardX = this.data.gameContents.items[i].x;
      // } else {
      //   oldCardX = CARD_START_X;
      // }
      // if (this.data.gameContents.items[i].y) {
      //   oldCardY = this.data.gameContents.items[i].y;
      // } else {
      //   oldCardY = CARD_START_Y;
      // }
      //计算新位置
      let cardRowIndex: number = Math.floor(this.cardsPositionIndex[i] / CARD_COLUMN_NUM);
      let cardColumnIndex: number = this.cardsPositionIndex[i] % CARD_COLUMN_NUM;
      this.data.gameContents.items[i].x = cardColumnIndex * CARD_H_GAP;
      this.data.gameContents.items[i].y = cardRowIndex * CARD_V_GAP;
      //console.info(document.querySelectorAll('ion-slides.card')[i], cardRowIndex, oldCardX, this.data.gameContents.items[i].x);
      //播放卡片移动动画
      a[i] = this.animationCtrl.create()
        .addElement(this.cardsElementRef.toArray()[i].nativeElement)
        .duration(500)
        .delay(i * delayOffset)
        .easing('ease-out')
        .iterations(1)
        // .fromTo('opacity', 0, 1)
        .fromTo('left', oldCardX + "px", this.data.gameContents.items[i].x + "px")
        .fromTo('top', oldCardY + "px", this.data.gameContents.items[i].y + "px")
        .onFinish(() => {
        });
      // await a[i].play();
    }
    const aGroup: Animation = this.animationCtrl.create()
      .addAnimation(a);
    await aGroup.play();
  }
  //游戏开始前的倒计时效果动画
  countDownNumber: string = "";
  async countDown(seconds: number) {
    let a: Animation;
    for (let i: number = seconds; i > 0; i--) {
      this.countDownNumber = i.toString();
      a = this.animationCtrl.create()
        .addElement(document.querySelector(".countdown-number"))
        .duration(800)
        .delay(200)
        .easing('ease-out')
        .iterations(1)
        .fromTo('transform', "translate(-50%, -50%) scale(0)", "translate(-50%, -50%) scale(1)")
        .onFinish(() => {
        });
      await a.play();
    }
    this.countDownNumber = "";
  }
  //选择卡片
  enable: boolean = false;
  async selectItem(event, item: CardData, index: number) {
    if (this.enable) {
      this.enable = false;
      let card: CardComponent = this.cards.toArray()[index] as CardComponent;
      await card.show();
      console.info(event, item);
      if (item.answer) {
        this.showRight();
      } else {
        this.showWrong();
        await card.hide();
        this.enable = true;
      }
    }
  }
  //正确效果
  async showRight() {
    RIGHT_SOUND.play();
    this.win()
    //this.cdRef.detectChanges();
  }
  //错误效果
  async showWrong() {
    WRONG_SOUND.play();
    // this.cdRef.detectChanges();
  }
  //完成游戏
  win() {
    this.endGame();
  }

}
class Game7Data extends GameData {
  gameContents: CardsGameData;
}
class CardsGameData {
  items: Array<CardData>;
}