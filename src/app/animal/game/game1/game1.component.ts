import { Component, AfterViewInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GameComponent, GameData, GAME_STATE, GAME_RESULT } from '../game.component';
import { AnimationController } from '@ionic/angular';
import { Animation } from '@ionic/core';

import { shuffle } from 'lodash';

@Component({
  selector: 'animal-game1',
  templateUrl: './game1.component.html',
  styleUrls: ['./game1.component.scss']
})
export class Game1Component implements AfterViewInit, GameComponent {
  //数据
  _data: Game1Data;
  @Input()
  set data(value: Game1Data) {
    if (value != null && value.type != null) {
      this._data = value;
      this.initGame();
      if (!this._data.startDialog) {
        this.startGameHandler();
      }
    }
  };
  get data(): Game1Data {
    return this._data;
  }
  constructor(private animationCtrl: AnimationController,
    private cdRef: ChangeDetectorRef) {
  }
  ngAfterViewInit() {
    // this.initGame();
  }
  gibbonName: string = "海南长臂猿";
  gibbonGenderMale: string = "雄性";
  gibbonGenderFemale: string = "雌性";
  /********************************************************************************************************************/
  gameState: string = GAME_STATE.READY;
  //初始化游戏，不能放到set data里面，因为phaser-div-game5可能还没生成
  initGame() {
    //初始化游戏
    this.resetGame()
  }
  //重置游戏场景
  resetGame() {
    this.gameState = GAME_STATE.READY;
  }
  //开始游戏
  startGameHandler() {
    this.processCatalogData();
    this.gameState = GAME_STATE.PLAYING;
  }
  endGame() {
    this.gameState = GAME_STATE.COMPLETED;
  }
  currentSelectedItem: GibbonData = null;
  result: string = GAME_RESULT.EMPTY;
  selectItem(item) {
    if (item.disabled || this.result != GAME_RESULT.EMPTY) { return; }
    // console.info(item);
    if (this.currentSelectedItem == null) {
      //当前没有中任何一项
      item.selected = true;
      this.currentSelectedItem = item;
    } else {
      //当前已经选中了一项
      if (this.currentSelectedItem.name == item.name && this.currentSelectedItem.gender == item.gender) {
        //取消选择
        item.selected = false;
        this.currentSelectedItem = null;
      } else if (this.currentSelectedItem.name != item.name && this.currentSelectedItem.gender == item.gender) {
        //切换选择
        this.currentSelectedItem.selected = false;
        item.selected = true;
        this.currentSelectedItem = item;
      } else if (this.currentSelectedItem.name == item.name && this.currentSelectedItem.gender != item.gender) {
        //配对正确
        item.selected = true;
        this.currentSelectedItem.disabled = true;
        item.disabled = true;
        this.showRight(item.name)
      } else if (this.currentSelectedItem.name != item.name && this.currentSelectedItem.gender != item.gender) {
        //配对错误
        this.currentSelectedItem.selected = false;
        this.showWrong()
      }
    }
  }
  //正确效果
  async showRight(name) {
    this.result = GAME_RESULT.RIGHT;
    this.gibbonName = name;
    let a: Animation = this.animationCtrl.create()
      .addElement(document.querySelector('.game-right-icon'))
      .duration(500)
      .iterations(1).fromTo('opacity', '0.5', '1');
    let b: Animation = this.animationCtrl.create()
      .addElement(document.querySelector('.game-right-icon'))
      .duration(1000)
      .iterations(1).fromTo('transform', 'translate(-50%, -50%) rotate(0deg)', 'translate(-50%, -50%) rotate(360deg)')
    let c: Animation = this.animationCtrl.create()
      .addElement(document.querySelector('.game-right-icon'))
      .duration(500)
      .iterations(1).fromTo('opacity', '1', '0');
    await a.play();
    await b.play();
    await c.play()
    this.result = GAME_RESULT.EMPTY;
    this.currentSelectedItem = null;
    this.gibbonName = "";
    this.win()
    this.cdRef.detectChanges();
  }
  //错误效果
  async showWrong() {
    this.result = GAME_RESULT.WRONG;
    let a: Animation = this.animationCtrl.create()
      .addElement(document.querySelector('.game-right-icon'))
      .duration(1000)
      .iterations(1)
      .fromTo('opacity', '0.5', '0')
      .onFinish(() => {
      });
    await a.play();
    this.result = GAME_RESULT.EMPTY;
    this.currentSelectedItem = null;
    this.cdRef.detectChanges();
  }
  //完成游戏
  win() {
    let completed: boolean = true;
    if (this.data.gameContents && this.data.gameContents.catalogs) {
      this.data.gameContents.catalogs.forEach(catalog => {
        catalog.items.forEach(item => {
          if (!item.disabled) {
            completed = false;
          }
          console.info(item.disabled);
        });
      });
    }
    if (completed) {
      this.endGame();
    }
  }
  //处理游戏数据
  processCatalogData() {
    if (this.data.gameContents && this.data.gameContents.catalogs) {
      this.data.gameContents.catalogs.forEach(catalog => {
        catalog.items.forEach(item => {
          item.gender = catalog.name;
          item.disabled = false;
          item.selected = false;
        });
        //乱序
        //catalog.items = shuffle(catalog.items);
        // console.info(catalog.items);
      });
    }
  }
  /****************************************************************/
}

class Game1Data extends GameData {
  gameContents: MatchGameData;
}
class MatchGameData {
  catalogs: Array<CatalogData>;
}
class CatalogData {
  name: string;
  items: Array<GibbonData>;
}
export class GibbonData {
  name: string;
  gender: string;
  imageURL: string;
  selected: boolean = false;
  disabled: boolean = false;
}

