import { Component, OnInit, ViewChild, ElementRef, Renderer2, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalsDataService } from '../animals-data.service';
import { MenuController, Events, IonSlides } from '@ionic/angular';
import { SIDEMENU_EVENT } from '../sidemenu/sidemenu.component';
import { GameDirective } from './game/game.directive';
import { GameComponent } from './game/game.component';
import { Game5Component } from './game/game5/game5.component';
@Component({
  selector: 'app-animal',
  templateUrl: './animal.page.html',
  styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit {
  @ViewChild("slides",{static:true}) slides:IonSlides;
  @ViewChild("bg",{static:true}) bg:ElementRef;
  @ViewChild(GameDirective, {static: true}) gameHost: GameDirective;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private animalsDataService: AnimalsDataService,
    // private popoverCtrl: PopoverController,
    private menuCtrl: MenuController,private render: Renderer2,
    private events: Events,
    private componentFactoryResolver: ComponentFactoryResolver) { 
    }
  animal: any = {};
  slideOpts = {
    loop: true
  }

  ngOnInit() {
    this.initMenu();
    this.route.paramMap.subscribe(params => {
      let data_url: string = params.get('animal_data_url');
      this.init(data_url);
    });
    this.initBg();
  }
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
  async initBg(){
    let swiper = await this.slides.getSwiper();
    let this_=this;
    swiper.on("progress",function(progress){
      this_.updateBackground(progress);
    })
  }
  //加载对应Game组件
  loadGameComponent() {
    // let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.animal.habits.type);
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(Game5Component);
    let viewContainerRef = this.gameHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<GameComponent>componentRef.instance).data = this.animal.habits;
  }

  //根据slides的位置，更新背景图位置
   async updateBackground(progress){
    let domWidth:number = window.innerWidth;
    let bgWidth:number=this.bg.nativeElement.naturalWidth;
    let slideNum = await this.slides.length()-2;//5
    if (!progress){
      let swiper = await this.slides.getSwiper();
      progress = swiper.progress;
    }
    let bgLeft:number=0;
    if (progress>=1/(slideNum+1)){
      bgLeft = (domWidth-bgWidth)*(progress-2/(slideNum+1))/((slideNum-2)/(slideNum+1));
    }else{
      bgLeft = (domWidth-bgWidth);
    }
    // console.info(domWidth,bgWidth,progress,slideNum,bgLeft)
    this.render.setStyle(this.bg.nativeElement,"left",bgLeft+"px")
  }


  //回主页
  onHome() {
    this.router.navigate(['home']);
  }
  //切换音乐静音
  onMusic() {

  }
  //打开菜单
  onMenu() {
    this.menuCtrl.open();
  }

  //初始化菜单
  initMenu() {
    this.events.publish(SIDEMENU_EVENT.UPDATE_SIDEMENU, "cn");
    this.events.subscribe(SIDEMENU_EVENT.SELECT_MENUITEM, (eventData) => {
      //let chapter = eventData;
      //console.log("target CFI: " + JSON.stringify(chapter));
      this.menuCtrl.close();
    });
  }
}
class AnimalData {
  name: string;
  bgURL:string;
  intro: JSON;
  feather: JSON;
  habitat: JSON;
  habit: JSON;
  protection: JSON;
}
