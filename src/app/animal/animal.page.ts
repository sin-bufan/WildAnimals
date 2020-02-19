import { Component, OnInit, ViewChild, ElementRef, Renderer2, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalsDataService } from '../animals-data.service';
import { MenuController, IonSlides } from '@ionic/angular';
import { GameDirective } from './game/game.directive';
import { GameComponent, GameData } from './game/game.component';
import { AlbumData } from './album/album.component';
import { MapData } from './map/map.component';
import { TimelineData } from './timeline/timeline.component';
import { CultureData } from './culture/culture.component';
import { KeypointData } from './keypoint/keypoint.component';

import { Game1Component } from './game/game1/game1.component';
import { Game5Component } from './game/game5/game5.component';
@Component({
  selector: 'app-animal',
  templateUrl: './animal.page.html',
  styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit,AfterViewInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private animalsDataService: AnimalsDataService,
    private menuCtrl: MenuController,
    private render: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver) {
  }

  @ViewChild("bg", { static: false }) bg: ElementRef;
  @ViewChild("slides", { static: false }) slides: IonSlides;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let data: any = JSON.parse(params.get('animal_data'));
      this.init(data.dataURL);
      this.initMenu(data.name);
    });
  }
  ngAfterViewInit(){
    this.initBg();
  }
  //初始化背景图
  async initBg() {
    let swiper = await this.slides.getSwiper();
    let this_ = this;
    swiper.on("progress", function (progress) {
      this_.updateBackground(progress);
    })
  }
  //根据slides的位置，更新背景图位置
  async updateBackground(progress=null) {
    let domWidth: number = window.innerWidth;
    let bgWidth: number = this.bg.nativeElement.width;
    let slideNum = await this.slides.length()
    if (!progress) {
      let swiper = await this.slides.getSwiper();
      progress = swiper.progress;
    }
    // console.info("slides progress: ", progress)
    let bgLeft: number = 0;
    if (progress <= 1 / (slideNum - 1)) {
      bgLeft = 0;
    } else if (progress > 1 / (slideNum - 1) && progress < 1) {
      // bgLeft = (domWidth - bgWidth) * (progress - 2 / (slideNum - 1)) / ((slideNum) / (slideNum - 1));
      bgLeft = (domWidth - bgWidth) * (progress - 1 / (slideNum - 1)) * ((slideNum - 1) / (slideNum - 2))
    } else {
      bgLeft = domWidth - bgWidth;
    }

    // console.info(domWidth,bgWidth,progress,slideNum,bgLeft)
    this.render.setStyle(this.bg.nativeElement, "left", bgLeft + "px")
  }


  //更新按钮状态
  prevButtonEnabled: boolean = false;
  nextButtonEnabled: boolean = true;
  async slidesChangeHandler(event) {
    let progress
    if (!progress) {
      let swiper = await this.slides.getSwiper();
      progress = swiper.progress;
    }
    let slideNum = await this.slides.length();
    if (progress < 1 / (slideNum - 1)) {
      this.prevButtonEnabled = false;
      this.nextButtonEnabled = true;
    } else if (progress > (slideNum - 2) / (slideNum - 1)) {
      this.prevButtonEnabled = true;
      this.nextButtonEnabled = false;
    } else {
      this.prevButtonEnabled = true;
      this.nextButtonEnabled = true;
    }
    //console.info(progress,this.prevButtonEnabled,this.nextButtonEnabled)
  }
  /*//对于loop slides
  slideOpts = {
    loop: true
  }
  //根据slides的位置，更新背景图位置
  async updateBackground(progress) {
    let domWidth: number = window.innerWidth;
    let bgWidth: number = this.bg.nativeElement.naturalWidth;
    let slideNum = await this.slides.length() - 2;//5
    if (!progress) {
      let swiper = await this.slides.getSwiper();
      progress = swiper.progress;
    }
    let bgLeft: number = 0;
    if (progress >= 1 / (slideNum + 1)) {
      bgLeft = (domWidth - bgWidth) * (progress - 2 / (slideNum + 1)) / ((slideNum - 2) / (slideNum + 1));
    } else {
      bgLeft = (domWidth - bgWidth);
    }
    // console.info(domWidth,bgWidth,progress,slideNum,bgLeft)
    this.render.setStyle(this.bg.nativeElement, "left", bgLeft + "px")
  }*/

  @ViewChild(GameDirective, { static: false }) gameHost: GameDirective;
  animal: AnimalData = new AnimalData();
  //初始化数据
  init(data_url: string) {
    this.animalsDataService.getAnimal(data_url).subscribe(
      (data) => {
        this.animal = data.animal;
        //console.info("Animal: ", this.animal)
        this.loadGameComponent();
      }
    );
  }
  //加载对应Game组件
  loadGameComponent() {
    // let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.animal.habits.type);
    let componentFactory
    if (this.animal.habits) {
      switch (this.animal.habits.type) {
        case "Game1Component":
          componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game1Component);
          break;
        case "Game5Component":
          componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game5Component);
          break;
      }
      let viewContainerRef = this.gameHost.viewContainerRef;
      viewContainerRef.clear();

      let componentRef = viewContainerRef.createComponent(componentFactory);
      (<GameComponent>componentRef.instance).data = this.animal.habits;
    }
  }
  /***************************************************************************************************************/
  //回主页
  onHome() {
    this.router.navigate(['home']);
  }
  //打开菜单
  onMenu() {
    this.menuCtrl.open();
  }
  //初始化菜单
  initMenu(name: string) {
    console.info("当前菜单：", name)
  }
}

class AnimalData {
  name: string = "";
  bgURL: string = "";
  intro: AlbumData;
  feather: KeypointData;
  habitat: MapData;
  habits: GameData;
  culture: CultureData;
  protection: TimelineData;
}
