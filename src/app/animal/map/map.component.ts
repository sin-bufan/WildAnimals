import { Component, OnInit } from '@angular/core';
declare var L;
@Component({
  selector: 'animal-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  constructor() { }
  m:any;
  ngOnInit() {
    this.initMap()
  }
  initMap(){
    this.m = L.map('map').setView([110, 35 ], 10);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by osm',
        minZoom: 3,
        maxZoom: 10
    }).addTo(this.m);

    var shpfile = new L.Shapefile('assets/data/congress.zip', {
			onEachFeature: function(feature, layer) {
				if (feature.properties) {
					layer.bindPopup(Object.keys(feature.properties).map(function(k) {
						return k + ": " + feature.properties[k];
					}).join("<br />"), {
						maxHeight: 200
					});
				}
			}
    });
    console.log("start loaded shapefile");
		shpfile.addTo(this.m);
		shpfile.once("data:loaded", function() {
			console.log("finished loaded shapefile");
		});
  }
}
