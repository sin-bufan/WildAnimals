import { Component, OnInit } from '@angular/core';

import * as Phaser from 'phaser';

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

  public game;
  public initialize: boolean;
  
  constructor() {
    this.initializeGame();
  }
  initializeGame() {
    this.game = {
      width: "100%",
      height: "100%",
      type: Phaser.AUTO,
      scene: {
        preload:this.preload,
        create:this.create
      }
    }
    this.initialize = true
  }
  preload(){
    console.info(this.game.scene.scenes[0])
    this.game.scene.scenes[0].load.image('bg','assets/bg.png')
  }
  create(){
    this.game.scene.scenes[0].add.image(400,300,'bg')
  }

  ngOnInit() {}

}
