import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { fromEvent } from 'rxjs';

const DESIGN_WIDTH: number = 1024;
const DESIGN_HEIGHT: number = 768;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }
  // lang:string;
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.resize();
    });

    fromEvent(window, 'resize')
      .subscribe((event) => {
        this.resize();
      });
  }
  public appScale: number = 1;
  resize() {
    this.appScale = Math.min(document.documentElement.clientWidth / DESIGN_WIDTH, document.documentElement.clientHeight / DESIGN_HEIGHT);
    // console.log('页面变化了: ', this.appScale);
  }
}
