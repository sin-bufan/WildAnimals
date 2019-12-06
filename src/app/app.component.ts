import { Component, ViewChild } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SIDEMENU_EVENT } from './sidemenu/sidemenu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events: Events
  ) {
    this.initializeApp();
  }
  lang:string;
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    //订阅事件更新侧边菜单
    this.events.subscribe(SIDEMENU_EVENT.UPDATE_SIDEMENU, (eventData) => {
      this.lang = eventData;
    });
  }
}
