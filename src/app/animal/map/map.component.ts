import { Component, AfterViewInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { AnimalsDataService } from 'src/app/animals-data.service';
import { IonSlides } from '@ionic/angular';
//地图限制区域
const CORNER_1 = L.latLng(37, -180);
const CORNER_2 = L.latLng(86, 16);
const MAP_BOUNDS = L.latLngBounds(CORNER_1, CORNER_2);

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
  @ViewChild("map", { static: true }) map: ElementRef;
  constructor(public animalsDataService: AnimalsDataService) { 
  }

  ngAfterViewInit() {
    let that = this;
    setTimeout(() => {
      if (that.m) {
        that.m.invalidateSize();
        // console.info(that.m.getSize())
      }
    }, 1000)
  }
  slideOpts = { allowTouchMove: false, allowSlidePrev: false }
  showMap() {
    if (this.hasMap) {
      this.mapSlides.slideNext();
      this.mapSlides.lockSwipes(true);
      this.m.invalidateSize();
    }
  }
  //初始化地图
  hasMap: boolean = true;
  initMap(mapData: MapData) {
    // let Leaflet = L.noConflict();//为了重复使用L实例
    // var container = L.DomUtil.get('map');
    // if (container != null) {
    //   console.log("map exited!!!")
    //   container._leaflet_id = null;
    // }
    // console.log(mapData.id);
    if (!mapData.mapPath) {
      this.hasMap = false;
      return;
    }
    this.hasMap = true;
    this.m = L.map(this.map.nativeElement, {
      attributionControl: false,
      minZoom: mapData.mapMinZoom,
      maxZoom: mapData.mapMaxZoom,
      maxBounds: MAP_BOUNDS
    }).setView([mapData.mapCenterX, mapData.mapCenterY], mapData.mapDefaultZoom);
    //加入瓦片地图
    L.tileLayer(mapData.mapPath + '{z}/{x}/{y}.png').addTo(this.m);
    let this_= this
    this.m.on("moveend",function (e){
      console.log(e,this_.m.getCenter())
   } )
    // L.tileLayer(mapData.mapPath + '{z}/tile-{x}_{y}.png').addTo(this.m);
    //加入现状分布图层
    // this.animalsDataService.getGEOJSON(mapData.habitatGeoJsonURL).subscribe(
    //   (data) => {
    //     L.geoJSON(data, {
    //       style: function (feature) {
    //         //console.info(feature);
    //         mapData.habitatLegend.forEach(item => {
    //           if (item.code == feature.properties.PRESENCE) {
    //             feature.properties.color = item.color;
    //             feature.properties.label = item.label;
    //             if (item.imageURL) {
    //               feature.properties.imageURL = item.imageURL;
    //             }
    //           }
    //         });
    //         return { stroke: false, fillOpacity: 0.7, color: feature.properties.color };
    //       }
    //     })
    //       //点击热区后弹出图文popup（放缩后有错位问题）
    //       .bindPopup(function (layer) {
    //         //console.info("map layer: ",layer);
    //         // return layer.feature.properties.BINOMIAL;
    //         // let url: string = layer.feature.properties.imageURL;
    //         // let label: string = layer.feature.properties.label;
    //         // if (url && url != "") {
    //         //   return "<img src=" + url + ">";
    //         // } else {
    //         //   return "<h2>" + label + "</h2>";
    //         // }
    //       },
    //         { minWidth: 400, closeButton: false })
    //       .addTo(this.m);
    //   }
    // );
  }

  // initMap(mapData: MapData) {
  //   // let Leaflet = L.noConflict();//为了重复使用L实例
  //   // var container = L.DomUtil.get('map');
  //   // if (container != null) {
  //   //   console.log("map exited!!!")
  //   //   container._leaflet_id = null;
  //   // }
  //   // console.log(mapData.id);
  //   if (!mapData.mapPath) {
  //     this.hasMap = false;
  //     return;
  //   }
  //   this.hasMap = true;
  //   this.m = L.map(this.map.nativeElement, {
  //     attributionControl: false,
  //     minZoom: mapData.mapMinZoom,
  //     maxZoom: mapData.mapMaxZoom,
  //     maxBounds: MAP_BOUNDS
  //   }).setView([mapData.mapCenterX, mapData.mapCenterY], mapData.mapDefaultZoom);
  //   //加入瓦片地图
  //   L.tileLayer(mapData.mapPath + '{z}/{x}/{y}.png').addTo(this.m);
  //   //加入现状分布图层
  //   this.animalsDataService.getGEOJSON(mapData.habitatGeoJsonURL).subscribe(
  //     (data) => {
  //       L.geoJSON(data, {
  //         style: function (feature) {
  //           //console.info(feature);
  //           mapData.habitatLegend.forEach(item => {
  //             if (item.code == feature.properties.PRESENCE) {
  //               feature.properties.color = item.color;
  //               feature.properties.label = item.label;
  //               if (item.imageURL) {
  //                 feature.properties.imageURL = item.imageURL;
  //               }
  //             }
  //           });
  //           return { stroke: false, fillOpacity: 0.7, color: feature.properties.color };
  //         }
  //       })
  //         //点击热区后弹出图文popup（放缩后有错位问题）
  //         .bindPopup(function (layer) {
  //           //console.info("map layer: ",layer);
  //           // return layer.feature.properties.BINOMIAL;
  //           // let url: string = layer.feature.properties.imageURL;
  //           // let label: string = layer.feature.properties.label;
  //           // if (url && url != "") {
  //           //   return "<img src=" + url + ">";
  //           // } else {
  //           //   return "<h2>" + label + "</h2>";
  //           // }
  //         },
  //           { minWidth: 400, closeButton: false })
  //         .addTo(this.m);
  //     }
  //   );
  // }
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