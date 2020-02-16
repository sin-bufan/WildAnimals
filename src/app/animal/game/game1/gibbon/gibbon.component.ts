import { Component, OnInit, Input } from '@angular/core';
import { GibbonData } from '../game1.component';

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
