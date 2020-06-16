import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AnimalsDataService } from '../animals-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
})
export class DownloadComponent implements OnInit {
  @Input() copyrightText: string;
  @Input() data: DownloadItem;
  lang:string;
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private animalsDataService: AnimalsDataService) {
      this.lang = this.animalsDataService.language;
  }
  onClose() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  ngOnInit() { }
  download(item){
    console.info(this.data,item.downloadFileURL)
    this.router.navigate([item.downloadFileURL])
  }
}
export class DownloadItem {
  name: string;
  downloadIconURL: string;
  downloadFileURL: string;
}