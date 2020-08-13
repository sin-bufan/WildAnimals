import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { GameComponent, GameData, GAME_STATE, RIGHT_SOUND, WRONG_SOUND } from '../game.component';
import { AnimationController, IonSlides, ModalController } from '@ionic/angular';
import { Animation } from '@ionic/core';

import { shuffle } from 'lodash';
import { RockComponent, RockData } from './rock/rock.component';
import { GameCompleteComponent } from '../gameComplete/gameComplete.component';
import { AnimalsDataService } from 'src/app/animals-data.service';

const ROCK_H_GAP: number = 150;
const ROCK_V_GAP: number = 120;
const ROCK_COLUMN_NUM: number = 4;
const ROCK_MAX_OFFSET: number = 30;
@Component({
  selector: 'app-game4',
  templateUrl: './game4.component.html',
  styleUrls: ['./game4.component.scss'],
})
export class Game4Component implements AfterViewInit, GameComponent {
  //数据
  _data: Game4Data;
  @Input()
  set data(value: Game4Data) {
    if (value != null && value.type != null) {
      this._data = value;
      this.initGame();
      if (!this._data.startDialog) {
        this.startGameHandler();
      }
    }
  };
  get data(): Game4Data {
    return this._data;
  }
  @ViewChildren("rock", { read: ElementRef }) rocksElementRef: QueryList<ElementRef>;
  @ViewChildren("rock") rocks: QueryList<RockComponent>;
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
    this.rocksPositionIndex = new Array();
    for (let i: number = 0; i < this.data.gameContents.items.length; i++) {
      this.rocksPositionIndex.push(i);
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
    console.info("reset")
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
  rocksPositionIndex: Array<number> = new Array();
  async showGame() {
    if (this.rocks) {
      this.rocks.toArray().forEach((rock: RockComponent) => { rock.hide(0) });
    }
    //发牌
    this.rocksPositionIndex = shuffle(this.rocksPositionIndex);
    this.findFishNum = 0;
    this.totalFishNum = this.data.gameContents.items.filter((rock) => {
      return rock.answer;
    }).length;
    await this.arrangeRocks(300, 100);
    this.enable = true;
  }
  //移动位置动画
  async arrangeRocks(duration: number = 1000, delayOffset: number = 0) {
    //新确定坐标
    let a: Array<Animation> = new Array(this.rocksPositionIndex.length);
    for (let i: number = 0; i < this.rocksPositionIndex.length; i++) {
      //计算基础位置
      let rockRowIndex: number = Math.floor(this.rocksPositionIndex[i] / ROCK_COLUMN_NUM);
      let rockColumnIndex: number = this.rocksPositionIndex[i] % ROCK_COLUMN_NUM;
      let rockX: number = rockColumnIndex * ROCK_H_GAP;
      let rockY: number = rockRowIndex * ROCK_V_GAP;
      let rockOffsetX: number = ROCK_MAX_OFFSET - Math.random() * ROCK_MAX_OFFSET * 2;
      let rockOffsetY: number = ROCK_MAX_OFFSET - Math.random() * ROCK_MAX_OFFSET * 2;
      let rockRotate: number = ROCK_MAX_OFFSET - Math.random() * ROCK_MAX_OFFSET * 2;
      //console.info('left', rockX + "px", ROCK_MAX_OFFSET - Math.random() * ROCK_MAX_OFFSET * 2 + "px");
      //console.info('top', rockY + "px", ROCK_MAX_OFFSET - Math.random() * ROCK_MAX_OFFSET * 2 + "px");
      //播放卡片移动动画
      a[i] = this.animationCtrl.create()
        .addElement(this.rocksElementRef.toArray()[i].nativeElement)
        .duration(300)
        .delay(i * delayOffset)
        .easing('ease-out')
        .iterations(1)
        // .fromTo('opacity', 0, 1)
        .fromTo('left', rockX + "px", rockX + rockOffsetX + "px")
        .fromTo('top', rockY + "px", rockY + rockOffsetY + "px")
        .fromTo('transform', "rotate(0deg)", "rotate(" + rockRotate + "deg)")
        .onFinish(() => {
        });
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
  findFishNum: number = 0;
  totalFishNum = 0;
  async selectItem(event, item: RockData, index: number) {
    let this_ = this;
    let rock: RockComponent = this.rocks.toArray()[index] as RockComponent;
    if (this.enable && !rock.data.open) {
      this.enable = false;
      await rock.show();
      // console.info(event, item);
      if (item.answer) {
        this.showRight();
        this.findFishNum++;
        if (this.findFishNum >= this.totalFishNum) {
          setTimeout(function () { this_.win() }, 1000);
        } else {
          this.enable = true;
        }
      } else {
        this.showWrong();
        await rock.hide();
        this.enable = true;
      }
    }
  }
  //正确效果
  async showRight() {
    RIGHT_SOUND.play();
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
class Game4Data extends GameData {
  gameContents: RockGameData;
}
class RockGameData {
  items: Array<RockData>;
}