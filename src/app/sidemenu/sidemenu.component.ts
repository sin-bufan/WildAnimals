import { Component, OnInit } from '@angular/core';
import { AnimalsDataService, AnimalIndexData } from '../animals-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  constructor(
    private animalsDataService: AnimalsDataService,
    private router: Router) { }

  ngOnInit() {
    this.initMenu();
  }

  animals: Array<AnimalIndexData> = [];
  //初始化菜单
  initMenu() {
    this.animalsDataService.getAnimals().subscribe(
      (data) => {
        this.animals = data.animals;
      }
    );
    //接收消息，变更当前选中的菜单项（home.page.ts）
    this.animalsDataService.$currentAnimal.subscribe(
      (value) => {
        this.currentAnimalName = value;
      }
    );
  }
  currentAnimalName:string=""
  //跳转到章节
  gotoAnimal(animal) {
    if (animal.dataURL && animal.dataURL != "") {
      this.currentAnimalName = animal.name;
      this.router.navigate(['animal', JSON.stringify(animal)]);
    }
  }
}
