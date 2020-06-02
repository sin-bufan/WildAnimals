import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'animal-game-complete',
  templateUrl: './gameComplete.component.html',
  styleUrls: ['./gameComplete.component.scss'],
})
export class GameCompleteComponent {
  @Input() data: GameComplete;
  constructor(private modalCtrl:ModalController) { 
  }
  onClose(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
export class GameComplete{
  imageURL:string;
  text:string;
}
