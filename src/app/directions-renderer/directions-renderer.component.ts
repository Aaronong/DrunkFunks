import { Component, OnInit, Input } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { DirectionsService } from '../directions.service';
import { Subscription } from 'rxjs';
import * as ons from "onsenui";

declare var google: any;

@Component({
  selector: 'map-directions-renderer',
  templateUrl: './directions-renderer.component.html',
  styleUrls: ['./directions-renderer.component.css']
})

export class DirectionsRendererComponent implements OnInit {

  private subNewDirections: Subscription;
  // directionsRenderer = new google.maps.DirectionsRenderer;
  // googleDirectionsService = new google.maps.DirectionsService;

  directionsRenderer;
  googleDirectionsService;
  currentMap;

  constructor (
    private gmapsApi: GoogleMapsAPIWrapper,
    private directionsService: DirectionsService,
  ) {
    (<any>window).renderService = this;
  }

  ngOnInit(){
    this.gmapsApi.getNativeMap().then(map => {
      this.currentMap = map;
      this.directionsRenderer = new google.maps.DirectionsRenderer;
      this.googleDirectionsService = new google.maps.DirectionsService;  
      var geocoder = new google.maps.Geocoder;
      this.directionsService.geoCoderIsReady(geocoder);
    })
    
    this.subNewDirections = this.directionsService.getNewDirectionsObservable().subscribe(
      next => {
        if (next) {   
          this.resetMap();
          this.requestDirections(next['origin'], next['destination'], next['waypoints']);
        }
      }
    );
  }

  requestDirections(origin, destination, waypoints) {
    this.googleDirectionsService.route({
        origin: {lat: origin.latitude, lng: origin.longitude},
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: "DRIVING"
    }, this.displayDirections);
  }

  displayDirections(result, status) {
    if (status == 'OK') {
      this['renderService'].directionsRenderer.setOptions({
        polylineOptions: {
            strokeColor: "#0000" + (Math.round(Math.random() * 0XFF)).toString(16)
        }
      });
      this['renderService'].directionsRenderer.setMap(this['renderService'].currentMap);
      this['renderService'].directionsRenderer.setDirections(result);
    } else if (status == 'ZERO_RESULTS') {
      ons.notification.toast("No Suggestions!", {
        timeout: 4000,
        modifier: "red"
      });
    } else {
      ons.notification.toast("An error occurred!", {
        timeout: 3000,
        modifier: "red"
      });
    } 
    this['renderService'].directionsService.updateFetchedDirection();
  }

  resetMap() {  
    this.directionsRenderer.setMap(null);
  }
}
