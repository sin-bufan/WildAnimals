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
  gameStarted:boolean=false;
  @ViewChild("options",{static:true}) options:IonSlides;
  constructor() {
    this_ = Object.create(this.constructor.prototype);
  } 
  //初始化游戏
  initializeGame() {
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
  }
  //初始化场景
  initializeScene(data:GameData){
    //console.info(data);
    this_.game.scene.remove('game');
  }
  startGame(){
    this.gameStarted=true;//这句一定要在初始化游戏之前
    //this_.initializeGame();
    //this_.initializeScene(this_.data);
  }
  ngAfterViewInit() {
  }

}
class GameData{
  type:string;
  intro:string;
  startDialog:StartGameDialog;
  game:GameNData;
}
class StartGameDialog{
  text:string;
}
enum GameNData{
  Game5Data
}