import { Component, OnInit } from '@angular/core';

import * as Phaser from 'phaser';
class BootScene extends Phaser.Scene {
  preload(){
    console.info(this)
    this.load.image('bg','assets/bg.png')
  }
  helloWorld: Phaser.GameObjects.Text

  init () {
    this.cameras.main.setBackgroundColor('#24252A');
    console.info(this.cameras.main.backgroundColor)
  }

  create () {

    this.add.image(0,0,'bg')
    this.helloWorld = this.add.text(
      this.cameras.main.centerX, 
      this.cameras.main.centerY, 
      "Hello World", { 
        font: "40px Arial", 
        fill: "#000000" 
      }
    );
  }

  update () {
    this.helloWorld.angle -= 1;
  }
}
interface GameInstance extends Phaser.Types.Core.GameConfig {
  instance: Phaser.Game
}

@Component({
  selector: 'animal-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  // public game = {
  //   width?: integer | string;
  //   height?: integer | string;
  //   zoom?: number;
  //   resolution?: number;
  //   type?: number;
  //   parent: HTMLElement | string;
  //   canvas?: HTMLCanvasElement;
  //   canvasStyle?: string;
  //   context?: CanvasRenderingContext2D;
  //   scene?: object;
  //   seed?: string[];
  //   title?: string;
  //   url?: string;
  //   version?: string;
  //   autoFocus?: boolean;
  //   input?: boolean | InputConfig;
  //   disableContextMenu?: boolean;
  //   banner?: boolean | BannerConfig;
  //   dom?: DOMContainerConfig;
  //   fps?: FPSConfig;
  //   render?: RenderConfig;
  //   backgroundColor?: string | number;
  //   callbacks?: CallbacksConfig;
  //   loader?: LoaderConfig;
  //   images?: ImagesConfig;
  //   physics?: object;
  //   plugins?: PluginObject | PluginObjectItem[];
  //   scale?: ScaleConfig;,
  //   instance: Game // It's created internally when the game is initialized
  // };

  game: GameInstance;
  initialize: boolean = false;
  
  constructor() {
    this.initializeGame();
  }

  getInstance () {
    return this.game.instance;
  }

  initializeGame() {
    this.game = {
      width: "100%",
      height: "100%",
      type: Phaser.AUTO,
      scene: BootScene,
      instance: new Phaser.Game()
    };
    this.initialize = true
  }

  ngOnInit() {
    this.initialize=true;
  }

}
