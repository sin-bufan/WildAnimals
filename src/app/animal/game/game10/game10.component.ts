import { Component, AfterViewInit, Input, ChangeDetectorRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { GameComponent, GameData, GAME_STATE, GAME_RESULT, RIGHT_SOUND, WRONG_SOUND } from '../game.component';
import { AnimationController } from '@ionic/angular';
import { Animation, Gesture } from '@ionic/core';
import { GestureController } from '@ionic/angular';
import { AnimalsDataService } from 'src/app/animals-data.service';
@Component({
  selector: 'app-game10',
  templateUrl: './game10.component.html',
  styleUrls: ['./game10.component.scss'],
})
export class Game10Component implements AfterViewInit, GameComponent {
  //数据
  _data: Game10Data;
  @Input()
  set data(value: Game10Data) {
    if (value != null && value.type != null) {
      this._data = value;
      this.initGame();
      if (!this._data.startDialog) {
        this.startGameHandler();
      }
    }
  };
  get data(): Game10Data {
    return this._data;
  }
  @ViewChild('circle') circle: ElementRef;
  lang: string
  constructor(private animationCtrl: AnimationController,
    private cdRef: ChangeDetectorRef,
    private render: Renderer2,
    private gestureCtrl: GestureController,
    private animalsDataService: AnimalsDataService) {
    this.lang = this.animalsDataService.language;
  }
  ngAfterViewInit() {
    // this.initGame();
    const gesture: Gesture = this.gestureCtrl.create({
      gestureName: 'game10-gesture',
      el: this.circle.nativeElement,
      onMove: (detail) => { this.onMove(detail); },
      onEnd: (detail) => { this.onEnd(detail); }
    });
    gesture.enable();
  }

  onMove(detail) {
    let d: number = this.currentDegree + detail.deltaX;
    console.info(d);
    while (d < 0) {
      d = d + 360;
    }
    while (d >= 360) {
      d = d - 360;
    }
    this.updateMonth(d);
  }

  currentDegree: number = 0;
  onEnd(detail) {
    this.currentDegree = this.currentDegree + detail.deltaX;
  }

  gameState: string = GAME_STATE.READY;
  //初始化游戏，不能放到set data里面，因为phaser-div-game5可能还没生成
  initGame() {
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
    this.updateMonth();
  }
  endGame() {
    this.gameState = GAME_STATE.COMPLETED;
  }

  monthImageURL: string;
  updateMonth(deg: number = 0) {
    this.render.setStyle(this.circle.nativeElement, "transform", "translateX(-50%) rotate(" + deg + "deg)");
    this.data.gameContents.forEach(m => {
      if (m.degree_start <= deg && deg < m.degree_end) {
        this.monthImageURL = m.imageURL;
        this.cdRef.detectChanges();
      }
    });
  }
}
class Game10Data extends GameData {
  gameContents: Array<MonthData>;
}

class MonthData {
  month: string;
  degree_start: number;
  degree_end: number;
  imageURL: string;
}