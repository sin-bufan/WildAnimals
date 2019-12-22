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
  //阻止上层的slides滑动
  blockEvent(event:Event){
    console.info(event)
    // event.originalEvent.stopImmediatePropagation();
    // event.originalEvent.stopPropagation();
    // event.originalEvent.preventDefault();
  }
  //初始化地图
  initMap(mapData: MapData) {
    //let Leaflet = L.noConflict();//为了重复使用L实例
    var container = L.DomUtil.get('map');
    if(container != null){
      container._leaflet_id = null;
    }

    this.m = L.map('map').setView([mapData.mapCenterX, mapData.mapCenterY], 5);
    this.m.on("mousedown",this.blockEvent)
    //加入瓦片地图
    L.tileLayer(mapData.mapPath + '{z}/{x}/{y}.png', {
      attributionControl: false,
      minZoom: mapData.mapMinZoom,
      maxZoom: mapData.mapMaxZoom
    }).addTo(this.m);
    
    //加入现状分布图层
    this.animalsDataService.getGEOJSON(mapData.habitatGeoJsonURL).subscribe(
      (data) => {
        L.geoJSON(data, {
          style: function (feature) {
            //console.info(feature);
            mapData.habitatLegend.forEach(item => {
              if (item.code == feature.properties.PRESENCE) {
                feature.properties.color = item.color;
                if (item.imageURL){
                  feature.properties.imageURL = item.imageURL;
                }
              }
            });
            return { stroke: false, opacity: 0.5, fillOpacity: 0.4, color: feature.properties.color };
          }
        }).bindPopup(function (layer) {
          console.info("map layer: ",layer);
          //return layer.feature.properties.BINOMIAL;
          let url:string = layer.feature.properties.imageURL;
          if (url!=""){
            return "<img class='map-popup' src="+url+">";
          }else{
            return null;
          }
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
  habitatGeoJsonURL: string;
  habitatLegend: Array<ExtantStatus>
}
//动物现状数据
class ExtantStatus {
  code: number;
  label: string;
  color: string;
  imageURL:string="";
}