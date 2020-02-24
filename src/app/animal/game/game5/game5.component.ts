import { Component, AfterViewInit, Input } from '@angular/core';

import * as Phaser from 'phaser';
import { GameComponent, GameData, GAME_STATE, RIGHT_SOUND, WRONG_SOUND } from '../game.component';
import { IonSlides } from '@ionic/angular';

let this_: Game5Component//once the Phaser scene is initialized, this contains the default game state
let eventEmitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
const RESULT_ANIMATION_COMPLETE: string = "resultAnimComplete";

@Component({
  selector: 'animal-game5',
  templateUrl: './game5.component.html',
  styleUrls: ['./game5.component.scss'],
})
export class Game5Component implements AfterViewInit, GameComponent {
  //数据
  _data: Game5Data;
  @Input()
  set data(value: Game5Data) {
    if (value != null && value.type != null) {
      this._data = value;
      if (!this._data.startDialog) {
        this.startGameHandler();
      }
    }
  };
  get data(): Game5Data {
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
  gameState: string = GAME_STATE.READY;
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
      audio: { disableWebAudio: true, noAudio: true }
    });
    //初始化场景
    eventEmitter.addListener(RESULT_ANIMATION_COMPLETE, this.resultAnimationCompleteHandler);
    this.resetGame()
  }
  //重置游戏场景
  resetGame() {
    this.gameOptions = undefined;
    this.game.scene.remove('game5');
    this.game.scene.add('game5', Game5Scene, true, this.data.gameContents);
    this.roundNo = -1;
    this.gameState = GAME_STATE.READY;
  }
  //开始游戏
  startGameHandler() {
    this.startRound(0);
    this.gameState = GAME_STATE.PLAYING;
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
  roundNo: number = -1;
  gameQuestion: string = "";
  gameOptions: Array<GameOption>
  optionNo: number;
  //开始回合
  startRound(roundNo: number) {
    this.roundNo = roundNo;
    this.gameQuestion = this.data.gameContents[roundNo].question;
    this.gameOptions = this.data.gameContents[roundNo].options;
    // console.info("this_: ",this_,);
    let game5: Game5Scene = <Game5Scene>this.game.scene.scenes[0];
    game5.showRound(roundNo);
  }
  //选择配重
  selectWeight(roundNo: number, optionNo: number) {
    this.roundNo = roundNo;
    this.gameOptions = this.data.gameContents[roundNo].options;
    this.optionNo = optionNo;
    let game5: Game5Scene = <Game5Scene>this.game.scene.scenes[0];
    game5.putWeight(roundNo, optionNo);
  }
  judgeResult() {
    // let that = this_;
    if (this.data.gameContents[this.roundNo].options[this.optionNo].answer) {
      //选择正确
      RIGHT_SOUND.once('end', function () {
        if (this_.roundNo >= this_.data.gameContents.length - 1) {
          // 游戏结束
          this_.endGame();
        } else {
          //下一题
          this_.roundNo++;
          this_.startRound(this_.roundNo);
        }
      });
      RIGHT_SOUND.play();
    } else {
      //选择错误
      WRONG_SOUND.once('end', function () {
        this_.startRound(this_.roundNo);
      });
      WRONG_SOUND.play();
    }
  }

  endGame() {
    this.gameQuestion = "";
    this.gameOptions = undefined;
    this.game.scene.remove('game5');
    this.gameState = GAME_STATE.COMPLETED;
  }
}

const QUESTION_PREFIX: string = 'balance';
const OPTION_PREFIX: string = 'weight';
const OPTION_ANIM_PREFIX: string = 'weight_anim';

const WEIGHT_X: number = 665;
const WEIGHT_START_Y: number = 160;
const WEIGHT_END_Y: number = 280;

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
    if (this.optionResultAnimSprite) {
      this.optionResultAnimSprite.destroy();
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
    let resultSpriteData: Sprite = this.rounds[roundNo].options[optionNo].resultSprite;
    let spriteName: string = OPTION_ANIM_PREFIX + "_" + String(roundNo) + "_" + String(optionNo);
    let animName: string = OPTION_ANIM_PREFIX + "_" + String(roundNo) + "_" + String(optionNo);
    // console.info("put weight: ", roundNo, optionNo, resultSprite, spriteName, animName)
    if (this.optionResultAnimSprite) {
      this.optionResultAnimSprite.destroy();
    }
    this.optionResultAnimSprite = this.add.sprite(resultSpriteData.spriteWidth / 2, resultSpriteData.spriteHeight / 2, spriteName);
    this.anims.create({
      key: animName,
      frames: this.anims.generateFrameNumbers(spriteName, { start: 0, end: resultSpriteData.spriteTotalFrameNum - 1 }),
      frameRate: resultSpriteData.spriteFrameRate,
      repeat: 0
    })
    this.optionResultAnimSprite.anims.delayedPlay(0, animName);
    this.optionResultAnimSprite.addListener(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, this.onAnimationEnd);
    return;
  }
  //动画每帧变动时执行
  onAnimationEnd(animation, frame, sprite) {
    //sprite.destroy();
    eventEmitter.emit(RESULT_ANIMATION_COMPLETE);
  }
  //4.循环刷新（16ms）
  update() {

  }
}

class Game5Data extends GameData {
  gameContents: Array<GameRound>;
}
// class StartGameDialog {
//   guide: string;
//   intro:string;
// }
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