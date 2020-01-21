import { Component, AfterViewInit, Input } from '@angular/core';

import * as Phaser from 'phaser';
import { GameComponent } from '../game.component';
import { IonSlides } from '@ionic/angular';

let this_: Game5Component//once the Phaser scene is initialized, this contains the default game state
let eventEmitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
const RESULT_ANIMATION_COMPLETE: string = "resultAnimComplete";
const GAME_STATE_START: number = -1;
const GAME_STATE_END: number = 999;

const WEIGHT_X: number = 665;
const WEIGHT_START_Y: number = 160;
const WEIGHT_END_Y: number = 280;
@Component({
  selector: 'animal-game5',
  templateUrl: './game5.component.html',
  styleUrls: ['./game5.component.scss'],
})
export class Game5Component implements AfterViewInit, GameComponent {
  //数据
  _data: GameData;
  @Input()
  set data(value: GameData) {
    if (value != null && value.type != null) {
      this._data = value;
      if (!this._data.startDialog) {
        this.startGameHandler();
      }
    }
  };
  get data(): GameData {
    return this._data;
  }
  constructor() {
    // this_ = Object.create(this.constructor.prototype);
    this_ = this;
  }
  ngAfterViewInit() {
    this.initGame();
  }
  slideOpts = {
    loop: false
  };
  /********************************************************************************************************************/
  game: Phaser.Game;
  //初始化游戏，不能放到set data里面，因为phaser-div-game5可能还没生成
  initGame() {
    //初始化游戏
    this.game = new Phaser.Game({
      width: 800,
      height: 576,
      transparent: true,
      type: Phaser.WEBGL,
      parent: 'phaser-div-game5',
      scene: [],
      audio: { noAudio: true }
    });
    //初始化场景
    eventEmitter.addListener(RESULT_ANIMATION_COMPLETE, this.resultAnimationCompleteHandler);
    this.resetGameScene()
  }
  //重置游戏场景
  resetGameScene() {
    this.gameOptions = undefined;
    this.game.scene.remove('game5');
    this.game.scene.add('game5', Game5Scene, true, this.data.gameRounds);
    this.roundNo = GAME_STATE_START;
  }
  //开始游戏
  startGameHandler() {
    this.startRound(0);
  }
  //选择选项
  async selectOptionHandler(optionsSlides: IonSlides) {
    let selectedIndex: number = await optionsSlides.getActiveIndex();
    this.selectWeight(this.roundNo, selectedIndex);
    this.gameOptions = undefined;
  }
  //播放动画完毕，判断
  resultAnimationCompleteHandler() {
    this_.judgeResult();
  }
  roundNo: number = GAME_STATE_START;
  gameOptions: Array<GameOption>
  optionNo: number;
  //开始回合
  startRound(roundNo: number) {
    this.roundNo = roundNo;
    this.gameOptions = this.data.gameRounds[roundNo].options;
    // console.info("this_: ",this_,);
    let game5: Game5Scene = <Game5Scene>this.game.scene.scenes[0];
    game5.showRound(roundNo);
  }
  //选择配重
  selectWeight(roundNo: number, optionNo: number) {
    this.roundNo = roundNo;
    this.gameOptions = this.data.gameRounds[roundNo].options;
    this.optionNo = optionNo;
    let game5: Game5Scene = <Game5Scene>this.game.scene.scenes[0];
    game5.putWeight(roundNo, optionNo);
  }
  judgeResult() {
    if (this.data.gameRounds[this.roundNo].options[this.optionNo].answer) {
      //选择正确
      if (this.roundNo >= this.data.gameRounds.length - 1) {
        // 游戏结束
        this.endGame();
      } else {
        //下一题
        this.roundNo++;
        this.startRound(this.roundNo);
      }
    } else {
      //选择错误
      this.startRound(this.roundNo);
    }
  }
  endGame() {
    this.gameOptions = undefined;
    this.game.scene.remove('game5');
    this.roundNo = GAME_STATE_END;
  }
}

const QUESTION_PREFIX: string = 'balance';
const OPTION_PREFIX: string = 'weight';
const OPTION_ANIM_PREFIX: string = 'weight_anim';
class Game5Scene extends Phaser.Scene {
  //1.初始化
  rounds: Array<GameRound>
  init(data) {
    this.rounds = data;
  }
  //2.加载素材
  preload() {
    for (let i: number = 0; i < this.rounds.length; i++) {
      //题目天平
      this.load.image(QUESTION_PREFIX + "_" + String(i), this.rounds[i].questionImageURL);
      for (let j: number = 0; j < this.rounds[i].options.length; j++) {
        //选项砝码
        this.load.image(OPTION_PREFIX + "_" + String(i) + "_" + String(j), this.rounds[i].options[j].imageURL);
        //结果动画
        let resultSprite: Sprite = this.rounds[i].options[j].resultSprite;
        this.load.spritesheet(OPTION_ANIM_PREFIX + "_" + String(i) + "_" + String(j), resultSprite.spriteURL, { frameWidth: resultSprite.spriteWidth, frameHeight: resultSprite.spriteHeight });
      }
    };
  }
  //3.创建舞台内容
  create(data) {
    // console.info("game ready!!!")
  }
  //开始一局
  question: Phaser.GameObjects.Image;
  optionResultAnimSprite: Phaser.GameObjects.Sprite;
  option: Phaser.GameObjects.Image;
  showRound(roundNo: number) {
    // console.log("start round: ", roundNo);
    if (this.question) {
      this.question.destroy();
    }
    this.question = this.add.image(400, 288, QUESTION_PREFIX + "_" + String(roundNo));
  }

  //播放结果动画
  putWeight(roundNo: number, optionNo: number) {
    //砝码动画
    let optionImageName: string = OPTION_PREFIX + "_" + String(roundNo) + "_" + String(optionNo);
    this.option = this.add.image(WEIGHT_X, WEIGHT_START_Y, optionImageName);
    let that = this
    this.tweens.add({
      targets: this.option,
      y: { from: WEIGHT_START_Y, to: WEIGHT_END_Y },
      ease: 'Bounce',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 1000,
      onComplete: function () { that.showOptionResultAnim(roundNo, optionNo) }

    })
  }

  //播放结果动画
  showOptionResultAnim(roundNo, optionNo): any {
    console.info(this)
    //删除天平
    if (this.question) {
      this.question.destroy();
    }
    if (this.option) {
      this.option.destroy();
    }
    // 播放结果动画
    let resultSprite: Sprite = this.rounds[roundNo].options[optionNo].resultSprite;
    let spriteName: string = OPTION_ANIM_PREFIX + "_" + String(roundNo) + "_" + String(optionNo);
    let animName: string = OPTION_ANIM_PREFIX + "_" + String(roundNo) + "_" + String(optionNo);
    // console.info("put weight: ", roundNo, optionNo, resultSprite, spriteName, animName)
    if (this.optionResultAnimSprite) {
      this.optionResultAnimSprite.destroy();
    }
    this.optionResultAnimSprite = this.add.sprite(resultSprite.spriteWidth / 2, resultSprite.spriteHeight / 2, spriteName);
    this.anims.create({
      key: animName,
      frames: this.anims.generateFrameNumbers(spriteName, { start: 0, end: resultSprite.spriteTotalFrameNum - 1 }),
      frameRate: resultSprite.spriteFrameRate,
      repeat: 0
    })
    this.optionResultAnimSprite.anims.delayedPlay(0, animName);
    this.optionResultAnimSprite.addListener('animationcomplete', this.onAnimationEnd);
    return;
  }
  //动画每帧变动时执行
  onAnimationEnd(animation, frame, sprite) {
    sprite.destroy();
    eventEmitter.emit("resultAnimComplete");
  }
  //4.循环刷新（16ms）
  update() {

  }
}




class GameData {
  type: string;
  intro: string;
  startDialog: StartGameDialog;
  gameRounds: Array<GameRound>;
}
class StartGameDialog {
  text: string;
}
class GameRound {
  question: string;
  questionImageURL: string;
  options: Array<GameOption>
}
class GameOption {
  imageURL: string;
  value: string;
  answer: boolean;
  resultSprite: Sprite;
}
class Sprite {
  spriteURL: string;
  spriteWidth: number;
  spriteHeight: number;
  spriteTotalFrameNum: number;
  spriteFrameRate: number;
}