import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';
import { AnimalsDataService } from '../animals-data.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  @Input('lang')
  set lang(value: string) {
    switch (value) {
      case "cn":
        this.initMenu(AnimalsDataService.CN_DATA_URL);
        break;
      case "en":
        this.initMenu(AnimalsDataService.EN_DATA_URL);
        break;
    }
  };

  animals: any = [];

  constructor(private events: Events,
    private animalsDataService: AnimalsDataService) { }

  ngOnInit() {  }

  //点击某个节点
  // openItem(item): void {
  //   this.events.publish(SIDEMENU_EVENT.SELECT_MENUITEM, item);
  // }

  initMenu(data_url: string) {
    this.animalsDataService.getAnimals(data_url).subscribe(
      (data) => {
        this.animals = data.animals;
        console.info("Side Menu Data: ", this.animals)
      }
    );
  }
}
export enum SIDEMENU_EVENT{
  UPDATE_SIDEMENU="UpdateSideMenu",SELECT_MENUITEM="SelectMenuItem"
}
