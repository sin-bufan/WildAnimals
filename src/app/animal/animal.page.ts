import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimalsDataService } from '../animals-data.service';

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
  }
}
