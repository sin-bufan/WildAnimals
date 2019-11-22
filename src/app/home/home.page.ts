import { Component } from '@angular/core';
import { AnimalsDataService } from '../animals-data.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  animals:any = [];
  constructor(private navCtrl:NavController,
    private animalsDataService: AnimalsDataService) {
  }

  ngOnInit() {
    this.init(AnimalsDataService.CN_DATA_URL)
  }
  //初始化数据
  init(data_url:string){
    this.animalsDataService.getAnimals(data_url).subscribe(
      (data) => { 
        this.animals = data.animals;
        console.info("Animals: ",this.animals)
      }
    );
  }
}
