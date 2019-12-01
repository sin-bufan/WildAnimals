import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import * as Phaser from 'phaser';
import {GameScene1} from './game-scene1'
let this_;
@Component({
  selector: 'animal-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
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
      parent:'phaser-div',
      scene: []
    });
    this.game.scene.remove('game');
    this.game.scene.add('game',GameScene1,true);
  }
  
  ngAfterViewInit() {
    this_.initializeGame()
  }

}
