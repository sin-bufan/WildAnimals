import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';

import * as Phaser from 'phaser';
import { GameComponent } from '../game.component';
import { IonSlides } from '@ionic/angular';

let this_: Game5Component//once the Phaser scene is initialized, this contains the default game state
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
      this_._data = value;
      if (!this_._data.startDialog) {
        this_.startGame();
      }
    }
  };
  get data(): GameData {
    return this_._data;
  }
  game: Phaser.Game;
  round: number = -1;
  @ViewChild("options", { static: true }) options: IonSlides;
  constructor() {
    this_ = Object.create(this.constructor.prototype);
  }
  //初始化游戏
  startGame() {
    this_.game = new Phaser.Game({
      width: 800,
      height: 576,
      transparent: true,
      type: Phaser.CANVAS,
      parent: 'phaser-div-game5',
      scene: [],
      audio: { noAudio: true }
    });
    this_.game.scene.remove('game5');
    this_.game.scene.add('game5', Game5Scene, true, this_.data.gameRounds);

    this.round = 0;
    this.gameOptions = this_.data.gameRounds[0].options;
    setTimeout(this_.startRound,1000,0)
    
  }
  gameOptions: Array<GameOption>
  startRound(roundNo: number) {
    this.gameOptions = this_.data.gameRounds[roundNo].options;
    //console.info(this.gameOptions)
    //this_.game.scene.start('game5',{roundNo:roundNo})
    this_.game.events.emit('goRound',{roundNo:roundNo});
    let game5:Game5Scene = this_.game.scene.scenes[0];
    console.info(game5,this_.game.scene.scenes,this_.game.scene.keys)
    game5.startRound(this.round);
  }

  ngAfterViewInit() {
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
    // console.log(BANLANCE_PREFIX + + String(0), this.rounds[0].questionImageURL);
    // this.load.image(BANLANCE_PREFIX + + String(0), this.rounds[0].questionImageURL);
    for (let i: number = 0; i < this.rounds.length; i++) {
      this.load.image(BANLANCE_PREFIX + String(i), this.rounds[i].questionImageURL);
      //console.info(BANLANCE_PREFIX + String(i),this.rounds[i].questionImageURL)
      for (let j: number = 0; j < this.rounds[i].options.length; j++) {
        let resultSprite: Sprite = this.rounds[i].options[j].resultSprite;
        this.load.spritesheet(BANLANCE_PREFIX + String(i) + "_" + String(j), resultSprite.spriteURL, { frameWidth: resultSprite.spriteWidth, frameHeight: resultSprite.spriteHeight });
        //console.info("spritesheet loaded!!!",resultSprite.spriteURL)
      }
    };
  }
  //3.创建舞台内容
  // animals:Phaser.GameObjects.Sprite;
  spriteArray: Array<Phaser.GameObjects.Sprite> = new Array();
  create(data) {
    // console.log(400, 288, BANLANCE_PREFIX + String(0));
    // this.add.image(400, 288, BANLANCE_PREFIX + String(0));
    // let sprite: Phaser.GameObjects.Sprite;
    // console.info("create started!")
    // for (let i: number = 0; i < this.rounds.length; i++) {
    //   for (let j: number = 0; j < this.rounds[i].options.length; j++) {
    //     let resultSprite: Sprite = this.rounds[i].options[j].resultSprite;
    //     if (j == 0) {
    //       this.add.image(resultSprite.spriteWidth / 2, resultSprite.spriteHeight / 2, BANLANCE_PREFIX + String(i));
    //       console.info(BANLANCE_PREFIX + String(i))
    //     }
    //     this.spriteArray[i] = this.add.sprite(resultSprite.spriteWidth / 2, resultSprite.spriteHeight / 2, BANLANCE_PREFIX + String(i) + "_" + String(j));
    //     //gameScene.spriteArray.push(sprite)
    //     this.anims.create({
    //       key: BANLANCE_PREFIX + String(i) + "_anim_" + String(j),
    //       frames: this.anims.generateFrameNumbers(BANLANCE_PREFIX + String(i) + "_" + String(j), { start: 0, end: resultSprite.spriteTotalFrameNum - 1 }),
    //       frameRate: resultSprite.spriteFrameRate,
    //       repeat: 1
    //     })
    //   }
    // };
    // console.info("animation created!!!", this.spriteArray);
    // this.anims.play("balance_0_0",this.spriteArray[0]);
    //this.spriteArray[0].setInteractive();
    // this.spriteArray[0].anims.play("balance_0_anim_0");
    // this.spriteArray[0].anims.delayedPlay(1, "balance_0_anim_0");
    //this.sprite.removeAllListeners();
    //this.sprite.addListener('animationupdate', this.onAnimationUpdate);

    this_.game.events.on('goRound',function(data){
      console.log("外部传值：",data.roundNo); 
  });
  }
  startRound(roundNo:number){
    console.log(400, 288, BANLANCE_PREFIX + String(0));
    this.add.image(400, 288, BANLANCE_PREFIX + String(0));
  }
  switchWeight(){

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