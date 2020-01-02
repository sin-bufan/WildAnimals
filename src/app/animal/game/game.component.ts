import { Component, AfterViewInit,Input } from '@angular/core';

import * as Phaser from 'phaser';
import {GameScene1} from './game-scene1';
import {GameScene2} from './game-scene2';
import {GameScene3} from './game-scene3';

import {GameScene5,Game5Data} from './game-scene5';

let this_:GameComponent//once the Phaser scene is initialized, this contains the default game state
@Component({
  selector: 'animal-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
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
    switch(data.type){
      case "Game1":
        this_.game.scene.add('game',GameScene1,true,data);
        break;
      case "Game2":
        this_.game.scene.add('game',GameScene2,true,data);
        break;
      case "Game3":
        this_.game.scene.add('game',GameScene3,true,data);
        break;
      case "Game5":
          this_.game.scene.add('game',GameScene5,true,data);
          break;
    }
  }
  gameStarted:boolean=false;
  startGame(){
    this_.initializeGame();
    this_.initializeScene(this_.data)
    this_.gameStarted=true;
    console.info(this_.gameStarted)
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