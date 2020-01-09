import { Component, AfterViewInit,Input, ViewChild } from '@angular/core';

import * as Phaser from 'phaser';
import { GameComponent } from '../game.component';
import { IonSlides } from '@ionic/angular';

let this_:Game5Component//once the Phaser scene is initialized, this contains the default game state
@Component({
  selector: 'animal-game5',
  templateUrl: './game5.component.html',
  styleUrls: ['./game5.component.scss'],
})
export class Game5Component implements AfterViewInit,GameComponent {
  //数据
  _data:GameData;
  @Input() 
  set data(value:GameData){
    if (value!=null && value.type!=null){
      this_._data = value;
      if (!this_._data.startDialog){
        this_.startGame();
      }
    }
  };
  get data():GameData{
    return this_._data;
  }
  game:Phaser.Game;
  round:number=-1;
  @ViewChild("options",{static:true}) options:IonSlides;
  constructor() {
    this_ = Object.create(this.constructor.prototype);
  } 
  //初始化游戏
  startGame(){
    this_.game = new Phaser.Game({
      width: "100%",
      height: "100%",
      type: Phaser.CANVAS,
      transparent:true,
      parent:'phaser-div',
      scene: [],
      dom:{
        createContainer: true
      }
    });
    this_.game.scene.remove('game5');
    this_.game.scene.add('game5', Game5Scene, true,this.data.gameRounds);
    this.startRound(0)
  }
  gameOptions:Array<GameOption>
  startRound(roundNo:number){
    this.round = 0;
    this.gameOptions=this.data.gameRounds[roundNo].options;
    console.info(this.gameOptions)
  }

  ngAfterViewInit() {
  }

}
let gameScene: Game5Scene;
const PAUSE_DELAY: number = 1500;
const SPRITE_WIDTH: number = 650;
const SPRITE_HEIGHT: number = 650;
const TOTAL_FRAME_NUM: number = 151;
const FRAME_RATE: number = 24;
const ANIMAL_PER_FRAME: number = 15;//ms
class Game5Scene extends Phaser.Scene {
  //1.初始化
  init(data) {
    gameScene = this;
  }
  //2.加载素材
  preload() {
    //this.load.spritesheet('balance', 'assets/images/animalIcon.png', { frameWidth: SPRITE_WIDTH, frameHeight: SPRITE_HEIGHT });
    //console.info("spritesheet loaded!!!")
  }
  //3.创建舞台内容
  // animals:Phaser.GameObjects.Sprite;
  sprite: Phaser.GameObjects.Sprite;
  create(data) {
    // this.sprite = this.add.sprite(SPRITE_WIDTH / 2, SPRITE_HEIGHT / 2, 'balance');
    // this.anims.create({
    //   key: 'game5',
    //   frames: this.anims.generateFrameNumbers('balance', { start: 0, end: TOTAL_FRAME_NUM - 1 }),
    //   frameRate: FRAME_RATE,
    //   repeat: -1
    // })
    //console.info("animation created!!!");
    //this.sprite.setInteractive();
    //this.sprite.anims.delayedPlay(PAUSE_DELAY, "game5");
    //this.sprite.removeAllListeners();
    //this.sprite.addListener('animationupdate', this.onAnimationUpdate);
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




class GameData{
  type:string;
  intro:string;
  startDialog:StartGameDialog;
  gameRounds:Array<GameRound>;
}
class StartGameDialog{
  text:string;
}
class GameRound{
  question:string;
  options:Array<GameOption>
}
class GameOption{
  imageURL:string;
  value:string;
  answer:boolean;
  resultSprite:Sprite;
}
class Sprite{
  spriteWidth:string;
  spriteHeight:string;
  spriteTotalFrameNum:string;
  spriteFrameRate:string;
}