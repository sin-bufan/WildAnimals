import { Component } from '@angular/core';
import { AnimalsDataService } from '../animals-data.service';
import * as Phaser from 'phaser';
import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';

let this_: HomePage//once the Phaser scene is initialized, this contains the default game state
let eventEmitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
const SELECT_MENU_INDEX: string = "selectMenuIndex";
const MENU_SCENE_NAME: string = "menu";
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  animals: any = [];
  menu: Phaser.Game;
  constructor(
    private animalsDataService: AnimalsDataService,
    private router: Router) {
    //this_ = Object.create(this.constructor.prototype);
    this_ = this;
  }
  //初始化
  ngOnInit() {
    this.loadLanguageData();
  }
  //初始化数据
  loadLanguageData(language: string = AnimalsDataService.CN) {
    this.animalsDataService.language = language;
    this.animalsDataService.getAnimals().subscribe(
      (data) => {
        this_.animals = data.animals;
      }
    );
  }
  download() { }
  info() {
    this.gotoAnimal(4);//临时用作跳转到大熊猫
  }
  /************************************************************************************************/
  //初始化menu
  ngAfterViewInit() {
    // console.info("initial Menu.....")
    //新建游戏
    this_.menu = new Phaser.Game({
      width: ANIMALS_SPRITE_WIDTH,
      height: ANIMALS_SPRITE_HEIGHT,
      transparent: true,
      type: Phaser.AUTO,
      parent: 'phaser-div-menu',
      scene: [],
      audio: { disableWebAudio: true, noAudio: true }
    });
    // 加入场景
    this_.menu.scene.remove(MENU_SCENE_NAME);
    this_.menu.scene.add(MENU_SCENE_NAME, MenuScene, true);

    //接受传出来的消息
    eventEmitter.addListener(SELECT_MENU_INDEX, this_.gotoAnimal);
    //返回到主页的时候重新启动menu动画
    this.router.events.subscribe(
      (event: NavigationEvent) => {
        if (event instanceof NavigationEnd) {
          console.log(event);
          if (event.url == "/home") {
            this_.menu.scene.resume(MENU_SCENE_NAME);
          }
        }
      }
    );
  }

  //跳转到章节
  gotoAnimal(index) {
    // console.info("enter animal: ", index)
    if (this_.animals[index].dataURL && this_.animals[index].dataURL != "") {
      this_.router.navigate(['animal', JSON.stringify(this_.animals[index])]);
      this_.animalsDataService.$currentAnimal.next(this_.animals[index].name)
      this_.menu.scene.pause(MENU_SCENE_NAME);
    }
  }
}



const PAUSE_DELAY: number = 2000;
const ANIMALS_SPRITE_WIDTH: number = 650;
const ANIMALS_SPRITE_HEIGHT: number = 650;
const TOTAL_FRAME_NUM: number = 151;
const FRAME_RATE: number = 24;
const FRAMES_PER_ANIMAL: number = 15;//ms

let menuScene: MenuScene;
const ANIMALS_SPRITE_URL: string = "assets/images/animalIcon.png"
const ANIMALS_SPRITE_NAME: string = "animals"
const MENU_ANIM_NAME: string = "menu"
class MenuScene extends Phaser.Scene {
  //1.初始化
  init() {
    menuScene = this;
  }
  //2.加载素材
  preload() {
    this.load.spritesheet(ANIMALS_SPRITE_NAME, ANIMALS_SPRITE_URL, { frameWidth: ANIMALS_SPRITE_WIDTH, frameHeight: ANIMALS_SPRITE_HEIGHT });
    //console.info("spritesheet loaded!!!")
  }
  //3.创建舞台内容
  // animals:Phaser.GameObjects.Sprite;
  sprite: Phaser.GameObjects.Sprite;
  create() {
    //创建动画
    this.sprite = this.add.sprite(ANIMALS_SPRITE_WIDTH / 2, ANIMALS_SPRITE_HEIGHT / 2, ANIMALS_SPRITE_NAME);
    this.anims.create({
      key: MENU_ANIM_NAME,
      frames: this.anims.generateFrameNumbers(ANIMALS_SPRITE_NAME, { start: 0, end: TOTAL_FRAME_NUM - 1 }),
      frameRate: FRAME_RATE,
      repeat: -1
    })
    //console.info("animation created!!!");
    //播放动画
    this.sprite.setInteractive();
    this.sprite.anims.delayedPlay(PAUSE_DELAY, MENU_ANIM_NAME);
    //console.info("animation played!!!",this.animation);
    //加监听事件
    this.sprite.removeAllListeners();
    this.sprite.addListener(Phaser.Animations.Events.SPRITE_ANIMATION_UPDATE, this.onAnimationUpdate);
    this.input.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onMouseDown);
    this.input.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.onMouseUp);
    this.input.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.onMouseUpOutside);
    this.input.addListener(Phaser.Input.Events.POINTER_MOVE, this.onMouseMove);
  }
  //动画每帧变动时执行
  press: boolean = false;//鼠标是否按下
  drag: boolean = false;//鼠标是否拖动中
  onAnimationUpdate(animation, frame, sprite) {
    // console.info(frame.index)
    if (frame.index % FRAMES_PER_ANIMAL == 0 && !menuScene.press) {
      // console.info(frame.index, animation, sprite)
      sprite.anims.pause();
      sprite.anims.delayedPlay(PAUSE_DELAY, MENU_ANIM_NAME, frame.index);
    }
  }
  //手势控制
  onMouseDown(pointer, currentlyOver) {
    //console.info("Down: ",pointer,currentlyOver,menuScene.touching);
    if (!menuScene.press) {
      menuScene.sprite.anims.pause();
      menuScene.press = true;
      menuScene.drag = false;
    } else {
      //console.info("mouse down out!!!")
    }
  }
  onMouseUp(pointer, currentlyOver) {
    if (menuScene.press) {
      // console.info("Up: ", pointer, menuScene.press);
      //回复动画
      // menuScene.sprite.anims.resume();//不使用resume，是因为会被delayedPlay函数影响
      menuScene.sprite.anims.play(MENU_ANIM_NAME, false, menuScene.sprite.anims.currentFrame.index);
      menuScene.press = false;
      if (!menuScene.drag) {
        //进入章节
        let animalIndex: number = Math.floor(menuScene.sprite.anims.currentFrame.index / FRAMES_PER_ANIMAL);
        eventEmitter.emit(SELECT_MENU_INDEX, animalIndex)
      }
      menuScene.drag = false;
    }
  }
  onMouseUpOutside(pointer) {
    if (menuScene.press) {
      // console.info("Up Outside: ",pointer,menuScene.press);
      // menuScene.sprite.anims.resume();//不使用resume，是因为会被delayedPlay函数影响
      menuScene.sprite.anims.play(MENU_ANIM_NAME, false, menuScene.sprite.anims.currentFrame.index);
      menuScene.press = false;
      menuScene.drag = false;
    }
  }
  onMouseMove(pointer, currentlyOver) {
    //console.info("Move: ",pointer,pointer.worldX-pointer.downX,currentlyOver);
    if (menuScene.press) {
      menuScene.drag = true;
      if (pointer.position.x - pointer.prevPosition.x < -1) {
        menuScene.sprite.anims.nextFrame();
      }
      else if (pointer.position.x - pointer.prevPosition.x > 1) {
        if (menuScene.sprite.anims.currentFrame.index > 1) {
          menuScene.sprite.anims.previousFrame();
        } else {
          // console.info(menuScene.sprite.anims.getTotalFrames()-1);
          menuScene.sprite.anims.setCurrentFrame(menuScene.sprite.anims.currentAnim.frames[menuScene.sprite.anims.getTotalFrames() - 1])
        }
      }
    }
  }
  //4.循环刷新（16ms）
  update() {

  }
}
