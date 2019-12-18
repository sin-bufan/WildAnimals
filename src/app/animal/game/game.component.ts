import { Component, AfterViewInit,Input } from '@angular/core';

import * as Phaser from 'phaser';
import {GameScene1} from './game-scene1';
import {GameScene2} from './game-scene2';

let this_//once the Phaser scene is initialized, this contains the default game state
@Component({
  selector: 'animal-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  //数据
  @Input() 
  set data(data:GameData){
    if (data!=null && data.type!=null){
      this_.initializeScene(data)
    }
  };
  game:Phaser.Game;
  constructor() {
    this_ = Object.create(this.constructor.prototype);
  } 
  //初始化游戏
  initializeGame() {
    this_.game = new Phaser.Game({
      width: "100%",
      height: "100%",
      type: Phaser.AUTO,
      transparent:true,
      parent:'phaser-div',
      scene: []
    });
    this_.game.scene.remove('game');
  }
  //初始化场景
  initializeScene(data:GameData){
    console.info(data);
    switch(data.type){
      case "Game1":
        this_.game.scene.add('game',GameScene1,true,data);
        break;
      case "Game2":
        this_.game.scene.add('game',GameScene2,true,data);
        break;
    }
  }
  ngAfterViewInit() {
    this_.initializeGame()
  }

}
class GameData{
  type:string;
}