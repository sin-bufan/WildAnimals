import { Component, OnInit, ViewChild, ElementRef, Renderer2, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalsDataService } from '../animals-data.service';
import { MenuController, IonSlides, AnimationController } from '@ionic/angular';
import { GameDirective } from './game/game.directive';
import { GameComponent, GameData } from './game/game.component';
import { AlbumData } from './album/album.component';
import { MapData } from './map/map.component';
import { TimelineData } from './timeline/timeline.component';
import { CultureData } from './culture/culture.component';
import { KeypointData } from './keypoint/keypoint.component';

import { Game1Component } from './game/game1/game1.component';
import { Game2Component } from './game/game2/game2.component';
import { Game3Component } from './game/game3/game3.component';
import { Game4Component } from './game/game4/game4.component';
import { Game5Component } from './game/game5/game5.component';
import { Game6Component } from './game/game6/game6.component';
import { Game7Component } from './game/game7/game7.component';
import { Game8Component } from './game/game8/game8.component';
import { Game9Component } from './game/game9/game9.component';
import { Game10Component } from './game/game10/game10.component';
import { AppComponent } from '../app.component';

const LOCK_SLIDE_LIST: Array<string> = ["map", "game10Circle", "game3QuestionImage"]
@Component({
  selector: 'app-animal',
  templateUrl: './animal.page.html',
  styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private animalsDataService: AnimalsDataService,
    private menuCtrl: MenuController,
    private render: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private app: AppComponent,
    private animationCtrl: AnimationController) {
  }

  @ViewChild("bg", { static: false }) bg: ElementRef;
  @ViewChild("slides", { static: false }) slides: IonSlides;
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.route.paramMap.subscribe(params => {
      let data: any = JSON.parse(params.get('animal_data'));
      this.init(data.dataURL);
      this.initMenu(data.name);
      this.initBg();
    });
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
  lastBgLeft: number = 0;
  async updateBackground(progress = null) {
    let domWidth: number = window.innerWidth / this.app.appScale;
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
      bgLeft = (domWidth - bgWidth);
    }
    // this.render.setStyle(this.bg.nativeElement, "left", bgLeft + "px");
    // console.log("transition: ", this.lastBgLeft + "px", bgLeft + "px",Math.abs(bgLeft - this.lastBgLeft))
    if (Math.abs(bgLeft - this.lastBgLeft) > 1) {
      // console.log("transition animation!!!")
      const a = this.animationCtrl.create()
        .addElement(this.bg.nativeElement)
        .duration(Math.abs(bgLeft - this.lastBgLeft))
        .iterations(1)
        .fromTo('left', this.lastBgLeft + "px", bgLeft + "px");
      await a.play();
    } else {
      // console.log("no transition animation!!!",bgLeft)
      this.render.setStyle(this.bg.nativeElement, "left", bgLeft + "px");
    }
    this.lastBgLeft = bgLeft;
    //console.log(this.lastBgLeft)
  }
  //更新按钮状态
  prevButtonEnabled: boolean = false;
  nextButtonEnabled: boolean = true;
  async slidesDidChangeHandler(event) {
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
  slideOpts = {
    loop: false,
    allowTouchMove: false,
    // watchSlidesProgress:true,
    speed: 1000//按钮翻页速度
  }
  /*//对于loop slides

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
        if (this.animal.habits) { this.loadGameComponent(); }
      }
    );
  }
  //加载对应Game组件
  loadGameComponent() {
    // let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.animal.habits.type);
    if (this.gameHost) {
      let componentFactory
      if (this.animal.habits) {
        switch (this.animal.habits.type) {
          case "Game1Component":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game1Component);
            break;
          case "Game2Component":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game2Component);
            break;
          case "Game3Component":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game3Component);
            break;
          case "Game4Component":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game4Component);
            break;
          case "Game5Component":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game5Component);
            break;
          case "Game6Component":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game6Component);
            break;
          case "Game7Component":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game7Component);
            break;
          case "Game8Component":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game8Component);
            break;
          case "Game9Component":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game9Component);
            break;
          case "Game10Component":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game10Component);
            break;
        }

        let viewContainerRef = this.gameHost.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<GameComponent>componentRef.instance).data = this.animal.habits;
      }
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
    // console.info("当前菜单：", name)
  }
  //阻止上层的slides滑动
  lockSlide(event: Event) {
    let t: any = event.target;
    //console.info("lock: ",event,t.id,LOCK_SLIDE_LIST,LOCK_SLIDE_LIST.indexOf(t.id));
    if (t.id && LOCK_SLIDE_LIST.indexOf(t.id) >= 0) {
      // console.info(event, event.target);
      this.slides.lockSwipes(true);
    }
  }
  unlockSlide(event: Event) {
    //console.info("unlock: ",event);
    this.slides.lockSwipes(false);
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
