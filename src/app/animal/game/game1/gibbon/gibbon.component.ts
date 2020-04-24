import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'game1-gibbon',
  templateUrl: './gibbon.component.html',
  styleUrls: ['./gibbon.component.scss'],
})
export class GibbonComponent implements OnInit {
  @Input() data:GibbonData;
  constructor() { }

  ngOnInit() {}

}

export class GibbonData {
  name: string;
  gender: string;
  imageURL: string;
  selected: boolean = false;
  disabled: boolean = false;
}