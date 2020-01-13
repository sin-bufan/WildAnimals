import { Component, AfterViewInit,Input, ViewChild } from '@angular/core';

import * as Phaser from 'phaser';
import { GameComponent } from '../game.component';
import { IonSlides } from '@ionic/angular';
import { stringify } from 'querystring';

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
class Game5Scene extends Phaser.Scene {
  //1.初始化
  rounds:Array<GameRound>
  init(data) {
    gameScene = this;
    this.rounds = data;
  }
  //2.加载素材
  preload() {
    for(let i:number = 0;i<this.rounds.length;i++){
      for(let j:number = 0;j<this.rounds[i].options.length;j++){
        let resultSprite:Sprite = this.rounds[i].options[j].resultSprite;
        this.load.spritesheet('balance_'+String(i)+"_"+String(j), resultSprite.spriteURL, { frameWidth: resultSprite.spriteWidth, frameHeight: resultSprite.spriteHeight });
        console.info("spritesheet loaded!!!")
      }
    };
  }
  //3.创建舞台内容
  // animals:Phaser.GameObjects.Sprite;
  spriteArray: Array<Phaser.GameObjects.Sprite>=new Array();
  create(data) {
    let sprite:Phaser.GameObjects.Sprite
    for(let i:number = 0;i<this.rounds.length;i++){
      for(let j:number = 0;j<this.rounds[i].options.length;j++){
        let resultSprite:Sprite = this.rounds[i].options[j].resultSprite;
        sprite = this.add.sprite(resultSprite.spriteWidth / 2, resultSprite.spriteHeight / 2, 'balance_'+String(i)+"_"+String(j));
        //gameScene.spriteArray.push(sprite)
        this.anims.create({
          key: 'balance_'+String(i)+"_"+String(j),
          frames: this.anims.generateFrameNumbers('balance_'+String(i)+"_"+String(j), { start: 0, end: resultSprite.spriteTotalFrameNum - 1 }),
          frameRate: resultSprite.spriteFrameRate,
          repeat: -1
        })
      }
    };
    console.info("animation created!!!",this);
    //this.anims.play("balance_0_0",null);
    //this.sprite.setInteractive();
    //sprite.anims.play("balance_0_4");
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
  spriteURL:string;
  spriteWidth:number;
  spriteHeight:number;
  spriteTotalFrameNum:number;
  spriteFrameRate:number;
}