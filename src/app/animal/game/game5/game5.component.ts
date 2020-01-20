import { Component, AfterViewInit, Input } from '@angular/core';

import * as Phaser from 'phaser';
import { GameComponent } from '../game.component';

// let this_: Game5Component//once the Phaser scene is initialized, this contains the default game state
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
      //this.initGame();
      if (!this._data.startDialog) {
        this.startGame();
      }
    }
  };
  get data(): GameData {
    return this._data;
  }
  constructor() {
    // this_ = Object.create(this.constructor.prototype);
  }
  ngAfterViewInit() {
    this.initGame();
  }

  /********************************************************************************************************************/
  game: Phaser.Game;
  //初始化游戏，不能放到set data里面，因为phaser-div-game5可能还没生成
  initGame() {
    //初始化游戏
    this.game = new Phaser.Game({
      width: 800,
      height: 576,
      transparent: true,
      type: Phaser.CANVAS,
      parent: 'phaser-div-game5',
      scene: [],
      audio: { noAudio: true }
    });
    //初始化场景
    this.game.scene.remove('game5');
    this.game.scene.add('game5', Game5Scene, true, this.data.gameRounds);
  }
  //开始游戏
  startGame() {
    //this.startRound(0);
    this.selectWeight(0,1);
  }
  round: number = -1;
  gameOptions: Array<GameOption>
  //开始回合
  startRound(roundNo: number) {
    this.round = roundNo;
    this.gameOptions = this.data.gameRounds[roundNo].options;
    // console.info("this_: ",this_,);
    let game5: Game5Scene = <Game5Scene>this.game.scene.scenes[0];
    game5.startRound(roundNo);
  }
  selectWeight(roundNo: number,optionNo:number) {
    this.round = roundNo;
    this.gameOptions = this.data.gameRounds[roundNo].options;
    let game5: Game5Scene = <Game5Scene>this.game.scene.scenes[0];
    game5.putWeight(roundNo,optionNo);
  }
}

let gameScene: Game5Scene;
const BANLANCE_PREFIX: string = 'balance_';
class Game5Scene extends Phaser.Scene {
  //1.初始化
  rounds: Array<GameRound>
  init(data) {
    gameScene = this;
    this.rounds = data;
  }
  //2.加载素材
  preload() {
    for (let i: number = 0; i < this.rounds.length; i++) {
      this.load.image(BANLANCE_PREFIX + String(i), this.rounds[i].questionImageURL);
      for (let j: number = 0; j < this.rounds[i].options.length; j++) {
        let resultSprite: Sprite = this.rounds[i].options[j].resultSprite;
        this.load.spritesheet(BANLANCE_PREFIX + String(i) + "_" + String(j), resultSprite.spriteURL, { frameWidth: resultSprite.spriteWidth, frameHeight: resultSprite.spriteHeight });
      }
    };
  }
  //3.创建舞台内容
  create(data) {
    // this.anims.play("balance_0_0",this.spriteArray[0]);
    //this.spriteArray[0].setInteractive();
    // this.spriteArray[0].anims.play("balance_0_anim_0");
    // this.spriteArray[0].anims.delayedPlay(1, "balance_0_anim_0");
    //this.sprite.removeAllListeners();
    //this.sprite.addListener('animationupdate', this.onAnimationUpdate);
  }
  //开始一局
  startRound(roundNo: number) {
    console.log("start round: ",roundNo);
    this.add.image(400, 288, BANLANCE_PREFIX + String(roundNo));
  }
  //播放结果动画
  putWeight(roundNo: number, optionNo: number) {
    let resultSprite: Sprite = this.rounds[roundNo].options[optionNo].resultSprite;
    let spriteName:string = BANLANCE_PREFIX + String(roundNo) + "_" + String(optionNo);
    let animName:string = BANLANCE_PREFIX + String(roundNo) + "_anim_" + String(optionNo);
    
    console.info("put weight: ",roundNo,optionNo,resultSprite,spriteName,animName)
    let sprite = this.add.sprite(resultSprite.spriteWidth / 2, resultSprite.spriteHeight / 2, spriteName);
    this.anims.create({
      key: animName,
      frames: this.anims.generateFrameNumbers(spriteName, { start: 0, end: resultSprite.spriteTotalFrameNum - 1 }),
      frameRate: resultSprite.spriteFrameRate,
      repeat: 1
    })
    sprite.anims.play(animName);
  }
  //动画每帧变动时执行
  // onAnimationUpdate(animation, frame, sprite) {
  //   if (frame.index % ANIMAL_PER_FRAME == 0 && !menuScene.press) {
  //     //console.info(animation,frame,sprite)
  //     sprite.anims.pause();
  //     sprite.anims.delayedPlay(PAUSE_DELAY, "menu", frame.index);
  //   }
  // }
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