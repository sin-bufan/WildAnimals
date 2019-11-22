import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimalsDataService } from '../animals-data.service';
import * as Phaser from 'phaser';
@Component({
  selector: 'app-animal',
  templateUrl: './animal.page.html',
  styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit {

  constructor(private route: ActivatedRoute,
    private animalsDataService: AnimalsDataService) { }
  animal: any = {};
  slideOpts = {
    loop:true
  }
  public game;
  public initialize: boolean;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let data_url: string = params.get('animal_data_url');
      this.init(data_url);
    });
  }
  //初始化数据
  init(data_url: string) {
    this.animalsDataService.getAnimal(data_url).subscribe(
      (data) => {
        this.animal = data.animal;
        console.info("Animal: ", this.animal)
      }
    );

    this.initializeGame()
  }


  initializeGame() {
    this.game = {
      width: "100%",
      height: "100%",
      type: Phaser.AUTO,
      scene: {
        preload: this.preload,
        create: this.create
      }
    }
    this.initialize = true
  }
  preload() {
    console.info(this.game.scene.scenes[0])
    this.game.scene.scenes[0].load.image('bg', 'assets/bg.png')
  }
  create() {
    this.game.scene.scenes[0].add.image(400, 300, 'bg')
  }
  getInstance() {
    return this.game.instance
  }
}
