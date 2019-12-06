import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import * as L from 'leaflet';
import { AnimalsDataService } from 'src/app/animals-data.service';

@Component({
  selector: 'animal-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  //数据
  _data:MapData;
  @Input()
  set data(value: MapData) {
    if (value != null) {
      this._data = value;
      this.initMap(this._data)
    }
  };
  get data():MapData{
    return this._data;
  }
  
  m: L.Map;//地图实例
  constructor(private animalsDataService: AnimalsDataService) { }

  ngOnInit() {
  }
  //初始化地图
  initMap(mapData: MapData) {
    if (!this.m){
      this.m = L.map('map').setView([mapData.mapCenterX, mapData.mapCenterY], 5);
      //加入瓦片地图
      L.tileLayer(mapData.mapPath + '{z}/{x}/{y}.png', {
        attribution: '',
        minZoom: mapData.mapMinZoom,
        maxZoom: mapData.mapMaxZoom
      }).addTo(this.m);
    }
    //加入现状分布图层
    this.animalsDataService.getGEOJSON(mapData.habitatGeoJsonUrl).subscribe(
      (data) => {
        L.geoJSON(data, {
          style: function (feature) {
            //console.info(feature);
            mapData.habitatLegend.forEach(item => {
              if (item.code == feature.properties.PRESENCE) {
                feature.properties.color = item.color;
              }
            });
            return { stroke: false, opacity: 0.5, fillOpacity: 0.4, color: feature.properties.color };
          }
        }).bindPopup(function (layer) {
          // console.info(layer);
          return layer.feature.properties.BINOMIAL;
        }).addTo(this.m);
      }
    );
  }
}
//地图数据
class MapData {
  text: string;
  mapPath: string;
  mapCenterX: number;
  mapCenterY: number;
  mapMaxZoom: number;
  mapMinZoom: number;
  mapDefaultZoom: number;
  habitatGeoJsonUrl: string;
  habitatLegend: Array<ExtantStatus>
}
//动物现状数据
class ExtantStatus {
  code: number;
  label: string;
  color: string;
}