import { Component } from '@angular/core';
import { AnimalsDataService } from '../animals-data.service';
import * as Phaser from 'phaser';
import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';

let this_//once the Phaser scene is initialized, this contains the default game state
let eventEmitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  animals: any = [];
  menu: Phaser.Game;
  router: Router;
  constructor(
    private animalsDataService: AnimalsDataService,
    private r: Router) {
    this_ = Object.create(this.constructor.prototype);
    this_.router = this.r;
    this_.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationEnd) {
            console.log(event);
            if (event.url == "/home") {
              this_.menu.scene.resume("menu");
            }
          }
        });
  }

  ngOnInit() {
    this.init(AnimalsDataService.CN_DATA_URL)
  }
  ngAfterViewInit() {
    this_.menu = new Phaser.Game({
      width: ANIMALS_SPRITE_WIDTH,
      height: ANIMALS_SPRITE_HEIGHT,
      transparent: true,
      type: Phaser.CANVAS,
      parent: 'phaser-div-menu',
      scene: [],
      audio: { noAudio: true }
    });
    this_.menu.scene.remove('menu');
    this_.menu.scene.add('menu', MenuScene, true);
    //接受传出来的消息
    eventEmitter.addListener("selectMenuIndex", this_.gotoAnimal);
  }

  //初始化数据
  init(data_url: string) {
    this.animalsDataService.getAnimals(data_url).subscribe(
      (data) => {
        this_.animals = data.animals;
        //console.info("Animals: ", this_.animals)
      }
    );
  }
  //跳转
  gotoAnimal(index) {
    console.info("enter animal: ", index)
    if (this_.animals[index].dataURL && this_.animals[index].dataURL != "") {
      this_.router.navigate(['animal', this_.animals[index].dataURL]);
      this_.menu.scene.pause("menu");
    }
  }
}

const PAUSE_DELAY: number = 1500;
const ANIMALS_SPRITE_WIDTH: number = 650;
const ANIMALS_SPRITE_HEIGHT: number = 650;
const TOTAL_FRAME_NUM: number = 151;
const FRAME_RATE: number = 24;
const ANIMAL_PER_FRAME: number = 15;//ms

let menuScene: MenuScene;
class MenuScene extends Phaser.Scene {
  //1.初始化
  init() {
    menuScene = this;
  }
  //2.加载素材
  preload() {
    this.load.spritesheet('animals', 'assets/images/animalIcon.png', { frameWidth: ANIMALS_SPRITE_WIDTH, frameHeight: ANIMALS_SPRITE_HEIGHT });
    //console.info("spritesheet loaded!!!")
  }
  //3.创建舞台内容
  // animals:Phaser.GameObjects.Sprite;
  sprite: Phaser.GameObjects.Sprite;
  create() {
    this.sprite = this.add.sprite(ANIMALS_SPRITE_WIDTH / 2, ANIMALS_SPRITE_HEIGHT / 2, 'animals');
    this.anims.create({
      key: 'menu',
      frames: this.anims.generateFrameNumbers('animals', { start: 0, end: TOTAL_FRAME_NUM - 1 }),
      frameRate: FRAME_RATE,
      repeat: -1
    })
    //console.info("animation created!!!");
    this.sprite.setInteractive();
    this.sprite.anims.delayedPlay(PAUSE_DELAY, "menu");
    //console.info("animation played!!!",this.animation);
    this.sprite.removeAllListeners();
    this.sprite.addListener('animationupdate', this.onAnimationUpdate);
    this.input.addListener('pointerdown', this.onMouseDown);
    this.input.addListener('pointerup', this.onMouseUp);
    this.input.addListener('pointerupoutside', this.onMouseUpOutside);
    this.input.addListener('pointermove', this.onMouseMove);
  }
  //动画每帧变动时执行
  press: boolean = false;
  onAnimationUpdate(animation, frame, sprite) {
    if (frame.index % ANIMAL_PER_FRAME == 0 && !menuScene.press) {
      //console.info(animation,frame,sprite)
      sprite.anims.pause();
      sprite.anims.delayedPlay(PAUSE_DELAY, "menu", frame.index);
    }
  }
  //手势控制
  onMouseDown(pointer, currentlyOver) {
    //console.info("Down: ",pointer,currentlyOver,menuScene.touching);
    if (!menuScene.press) {
      menuScene.sprite.anims.pause();
      setTimeout(function () {
        menuScene.press = true;
      }, 200)
    } else {
      //console.info("mouse down out!!!")
    }
  }
  onMouseUp(pointer, currentlyOver) {
    console.info("Up: ", pointer, menuScene.press);
    if (menuScene.press) {
      menuScene.sprite.anims.resume();
      menuScene.press = false;
    } else {
      let animalIndex: number = Math.floor(menuScene.sprite.anims.currentFrame.index / ANIMAL_PER_FRAME);
      eventEmitter.emit("selectMenuIndex", animalIndex)
    }
  }
  onMouseUpOutside(pointer) {
    //console.info("Up: ",pointer,menuScene.press);
    if (menuScene.press) {
      menuScene.sprite.anims.resume();
      menuScene.press = false;
    }
  }
  onMouseMove(pointer, currentlyOver) {
    //console.info("Move: ",pointer,pointer.worldX-pointer.downX,currentlyOver);
    if (menuScene.press) {
      if (pointer.position.x - pointer.prevPosition.x < -1) {
        menuScene.sprite.anims.nextFrame();
      }
      else if (pointer.position.x - pointer.prevPosition.x > 1) {
        if (menuScene.sprite.anims.currentFrame.index > 1) {
          menuScene.sprite.anims.previousFrame();
        } else {
          // console.info(menuScene.sprite.anims.getTotalFrames()-1);
          menuScene.sprite.anims.setCurrentFrame(menuScene.sprite.anims.currentAnim.frames[menuScene.sprite.anims.getTotalFrames()-1])
        }
      }
    }
  }
  //4.循环刷新（16ms）
  update() {

  }
}
