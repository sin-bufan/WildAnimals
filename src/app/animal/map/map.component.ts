import { Component, AfterViewInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { AnimalsDataService } from 'src/app/animals-data.service';
import { IonSlides } from '@ionic/angular';
@Component({
  selector: 'animal-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  //数据
  _data: MapData;
  @Input()
  set data(value: MapData) {
    if (value != null) {
      this._data = value;
      if (!this.m) {
        this.initMap(this._data);
      }
    }
  };
  get data(): MapData {
    return this._data;
  }

  m: L.Map;//地图实例
  @ViewChild("mapSlides", { static: false }) mapSlides: IonSlides;
  constructor(private animalsDataService: AnimalsDataService) { }

  ngAfterViewInit() {
    let that = this;
    setTimeout(() => {
      if (that.m) {
        that.m.invalidateSize();
        // console.info(that.m.getSize())
      }
    }, 1000)
  }
  slideOpts = {allowTouchMove:false,allowSlidePrev:false}
  showMap() {
    this.mapSlides.slideNext();
    this.mapSlides.lockSwipes(true);
    this.m.invalidateSize();
  }
  //初始化地图
  initMap(mapData: MapData) {
    //let Leaflet = L.noConflict();//为了重复使用L实例
    var container = L.DomUtil.get('map');
    if (container != null) {
      container._leaflet_id = null;
    }
    this.m = L.map('map').setView([mapData.mapCenterX, mapData.mapCenterY], 5);
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
                feature.properties.label = item.label;
                if (item.imageURL) {
                  feature.properties.imageURL = item.imageURL;
                }
              }
            });
            return { stroke: false, opacity: 0.5, fillOpacity: 0.4, color: feature.properties.color };
          }
        })
          //点击热区后弹出图文popup（放缩后有错位问题）
          // .bindPopup(function (layer) {
          //   //console.info("map layer: ",layer);
          //   //return layer.feature.properties.BINOMIAL;
          //   let url: string = layer.feature.properties.imageURL;
          //   let label: string = layer.feature.properties.label;
          //   if (url && url != "") {
          //     return "<img src=" + url + ">";
          //   } else {
          //     return "<h2>" + label + "</h2>";
          //   }
          // },
          //   { minWidth: 400, closeButton: false })
          .addTo(this.m);
      }
    );
  }
}
//地图数据
export class MapData {
  text: string;
  imageURL: string;
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
  imageURL: string = "";
}