import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'animal-culture',
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.scss'],
})
export class CultureComponent implements OnInit {
  //数据
  @Input() data: CultureData;
  constructor() { }

  ngOnInit() {}

}
export class CultureData {
  text: string = "";
  imageURL: string;
}