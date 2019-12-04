import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalsDataService } from '../animals-data.service';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.page.html',
  styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit {

  constructor(private route: ActivatedRoute,
  private router: Router,
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
  //回主页
  onHome(){
    console.info("go back")
    this.router.navigate(['home']);
  }
}
class AnimalData{
  name:string;
  intro:JSON;
  feather:JSON;
  habitat:JSON;
  habit:JSON;
  protection:JSON;
}
