import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
})
export class DownloadComponent implements OnInit {
  @Input() copyrightText: string;
  @Input() data: DownloadItem;
  constructor(private modalCtrl:ModalController) { 
  }
  onClose(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  ngOnInit() {}
}
export class DownloadItem{
  name:string;
  downloadIconURL:string;
  downloadFileURL:string;
}