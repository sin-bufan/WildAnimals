import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss'],
})
export class CopyrightComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController) {
  }
  onClose() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  ngOnInit() {}

}
