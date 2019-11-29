import { Component ,AfterViewInit} from '@angular/core';
// import * as L from 'leaflet';
declare var L;
@Component({
  selector: 'animal-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {

  constructor() { }
  m:any;
  ngAfterViewInit() {
    this.initMap()
  }
  initMap(){
    this.m = L.map('map').setView([36, 104 ], 5);
    const mapPath = './assets/data/cn/map/'
    L.tileLayer(mapPath+'{z}/{x}/{y}.png', {
        attribution: 'Map tiles by google',
        minZoom: 3,
        maxZoom: 8
    }).addTo(this.m);
 
    var shpfile = new L.Shapefile(mapPath+'redlist_species_data1.zip', {
			onEachFeature: function(feature, layer) {
        console.info(feature,layer)
				if (feature.properties) {
          console.info(feature)
					layer.bindPopup(Object.keys(feature.properties).map(function(k) {
						return k + ": " + feature.properties[k];
					}).join("<br />"), {
						maxHeight: 200
					});
				}
			}
    });
    console.log("start load shapefile");
		shpfile.addTo(this.m);
		shpfile.once("data:loaded", function() {
			console.log("finished loaded shapefile");
		}); 
  }
}
