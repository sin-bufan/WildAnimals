import { Component } from '@angular/core';
import { AnimalsDataService } from '../animals-data.service';
import * as Phaser from 'phaser';
import { Router } from '@angular/router';

let this_//once the Phaser scene is initialized, this contains the default game state
let eventEmitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
const PAUSE_DELAY: number = 1500;
const ANIMALS_SPRITE_WIDTH: number = 650;
const ANIMALS_SPRITE_HEIGHT: number = 650;
const TOTAL_FRAME_NUM: number = 151;
const FRAME_RATE: number = 24;
const ANIMAL_PER_FRAME: number = 15;
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
  }

  ngOnInit() {
    this.init(AnimalsDataService.CN_DATA_URL)
  }
  ngAfterViewInit() {
    this_.menu = new Phaser.Game({
      width: "650px",
      height: "650px",
      transparent: true,
      type: Phaser.CANVAS,
      parent: 'phaser-div-menu',
      scene: [],
      audio:{noAudio:true}
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
    this_.router.navigate(['animal', this_.animals[index].dataURL]);
  }
}

class MenuScene extends Phaser.Scene {
  //1.初始化
  init() {

  }
  //2.加载素材
  preload() {
    this.load.spritesheet('animals', 'assets/images/animalIcon.png', { frameWidth: ANIMALS_SPRITE_WIDTH, frameHeight: ANIMALS_SPRITE_HEIGHT });
    //console.info("spritesheet loaded!!!")
  }
  //3.创建舞台内容
  // animals:Phaser.GameObjects.Sprite;
  create() {
    let sprite: Phaser.GameObjects.Sprite = this.add.sprite(ANIMALS_SPRITE_WIDTH / 2, ANIMALS_SPRITE_HEIGHT / 2, 'animals');
    this.anims.create({
      key: 'menu',
      frames: this.anims.generateFrameNumbers('animals', { start: 0, end: TOTAL_FRAME_NUM-1 }),
      frameRate: FRAME_RATE,
      repeat: -1
    })
    //console.info("animation created!!!");
    sprite.setInteractive();
    sprite.anims.setDelay(PAUSE_DELAY);
    sprite.anims.play("menu", true);
    //console.info("animation played!!!");
    sprite.removeAllListeners();
    sprite.addListener('animationupdate', this.onAnimationUpdate);
    this.input.addListener('pointerdown', this.onMouseDown);
    this.input.addListener('pointerup', this.onMouseUp);
    this.input.addListener('pointermove', this.onMouseMove);
  }
  //动画每帧变动时执行
  touching:boolean=false;
  onAnimationUpdate(animation, frame, sprite) {
    if (frame.index % ANIMAL_PER_FRAME == 0 && !this.touching) {
      //console.info(animation,frame,sprite)
      sprite.anims.pause();
      sprite.anims.setDelay(PAUSE_DELAY);
      sprite.anims.play();
    }
  }
  onMouseDown(pointer, localX,localY,event) {
    console.info("Down: ",pointer,localX,localY,event);
    //gameObject.anims.pause();
    this.touching=true;
  }
  onMouseUp(pointer, localX,localY, event) {
    console.info("Up: ",pointer,localX,localY,event);
    this.touching=false;
    //let animalIndex: number = Math.floor(gameObject.anims.currentFrame.index / ANIMAL_PER_FRAME);
    //eventEmitter.emit("selectMenuIndex", animalIndex)
  }
  onMouseMove(pointer,localX,localY, event) {
    console.info("MovelocalX,localY,: ",pointer,localX,localY,event);
    //gameObject.anims.pause();
    this.touching=true;
  }
  //4.循环刷新（16ms）
  update() {

  }
}
