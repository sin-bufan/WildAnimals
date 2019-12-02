import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { AnimalsDataService } from 'src/app/animals-data.service';
const PRESENCE: Array<ExtantStatus> = [{ "code":1,"label": "EXTANT (RESIDENT)", "color": "orange" }, { "code":3,"label": "POSSIBLY EXTANT (RESIDENT)", "color": "purple" }];
@Component({
  selector: 'animal-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {

  constructor(
    private animalsDataService: AnimalsDataService) { }
  m: any;
  ngAfterViewInit() {
    this.initMap()
  }
  initMap() {
    this.m = L.map('map').setView([36, 104], 5);
    const mapPath = './assets/data/cn/map/'
    L.tileLayer(mapPath + '{z}/{x}/{y}.png', {
      attribution: 'Map tiles by google',
      minZoom: 3,
      maxZoom: 8
    }).addTo(this.m);

    console.log("map overlay file path: ", mapPath + 'Panda.json');
    this.animalsDataService.getAnimal(mapPath + 'Panda.json').subscribe(
      (data) => {
        L.geoJSON(data, {
          style: function (feature) {
            console.info(feature);
            PRESENCE.forEach(item => {
              if (item.code ==feature.properties.PRESENCE){
                feature.properties.color = item.color;
              }
            });
            console.info(feature.properties.color);
            return { stroke:false,opacity:0.5,fillOpacity:0.4,color: feature.properties.color };
          }
        }).bindPopup(function (layer) {
          // console.info(layer);
          return layer.feature.properties.BINOMIAL;
        }).addTo(this.m);
      }
    );
  }
}
class ExtantStatus {
  code:number;
  label: string;
  color: string;
}