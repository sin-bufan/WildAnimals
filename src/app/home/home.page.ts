import { Component } from '@angular/core';
import { AnimalsDataService } from '../animals-data.service';
import { NavController } from '@ionic/angular';
import * as Phaser from 'phaser';

let this_//once the Phaser scene is initialized, this contains the default game state

const PAUSE_DELAY:number= 1500;
const ANIMALS_SPRITE_WIDTH:number = 650;
const ANIMALS_SPRITE_HEIGHT:number = 768;
const TOTAL_FRAME_NUM:number = 150;
const FRAME_RATE:number = 24;
const ANIMAL_PER_FRAME:number = 15;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  animals: any = [];
  game: Phaser.Game;
  constructor(private navCtrl: NavController,
    private animalsDataService: AnimalsDataService) {
    this_ = Object.create(this.constructor.prototype);
  }

  ngOnInit() {
    this.init(AnimalsDataService.CN_DATA_URL)
  }
  ngAfterViewInit() {
    this_.game = new Phaser.Game({
      width: "650px",
      height: "768px",
      transparent:true,
      type: Phaser.AUTO,
      parent: 'phaser-div',
      scene: []
    });
    this_.game.scene.remove('game');
    this_.game.scene.add('game', MenuScene, true);
  }
  //初始化数据
  init(data_url: string) {
    this.animalsDataService.getAnimals(data_url).subscribe(
      (data) => {
        this_.animals = data.animals;
        console.info("Animals: ", this_.animals)
      }
    );
  }
}

class MenuScene extends Phaser.Scene {
  //1.初始化
  init() {

  }
  //2.加载素材
  preload() {
    this.load.spritesheet('animals', 'assets/images/animalIcon.png', { frameWidth: ANIMALS_SPRITE_WIDTH, frameHeight: ANIMALS_SPRITE_HEIGHT });
    console.info("spritesheet loaded!!!")
  }
  //3.创建舞台内容
  // animals:Phaser.GameObjects.Sprite;
  create() {
    let sprite:Phaser.GameObjects.Sprite = this.add.sprite(ANIMALS_SPRITE_WIDTH/2, ANIMALS_SPRITE_HEIGHT/2, 'animals');
    this.anims.create({
      key : 'all',
      frames : this.anims.generateFrameNumbers('animals',{start : 0,end : TOTAL_FRAME_NUM}),
      frameRate : FRAME_RATE,
      repeat : -1
    })
 
    sprite.anims.setDelay(PAUSE_DELAY);
    sprite.anims.play("all",true);
    //sprite.on('animationupdate',this.onAnimationUpdate)
    sprite.removeAllListeners();
    sprite.addListener('animationupdate',this.onAnimationUpdate);
    sprite.addListener('gameobjectdown',this.onClick);
  }
  //动画每帧变动时执行
  onAnimationUpdate(animation,frame,sprite){
    if (frame.index%ANIMAL_PER_FRAME==0){
      //console.info(animation,frame,sprite)
      sprite.anims.pause();
      sprite.anims.setDelay(PAUSE_DELAY);
      sprite.anims.play();
    }
  }
  onClick(pointer,localX,localY,event){
    console.info(pointer,localX,localY,event)
  }
  //4.循环刷新（16ms）
  update() {

  }
}
