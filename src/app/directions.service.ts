import { Injectable } from '@angular/core';
import { Headers, Http } from "@angular/http";
import { Observable, Subject } from "rxjs";

@Injectable()
export class DirectionsService {

  private getDirections = new Subject<Object>();
  private fetchedDirections = new Subject<boolean>();
  private geoCoderReady = new Subject<string>();

  private geocoder;

  constructor(
    private http: Http,
  ) {
    (<any>window).dirService = this;
   }

  getNewDirections(newDirections: Object) {
    this.getDirections.next(newDirections);
  }

  updateFetchedDirection() {
    this.fetchedDirections.next(true);
  }

  getNewDirectionsObservable(): Observable<Object> {
    return this.getDirections.asObservable();
  }

  getFetchedDirectionsObservable(): Observable<boolean> {
    return this.fetchedDirections.asObservable();
  }

  geoCoderIsReady(geocoder) {
    this.geocoder = geocoder;
    this.geoCoderReady.next("_ready");
  }

  getGeoCoderObservable(): Observable<string> {
    return this.geoCoderReady.asObservable();
  }

  reverseGeoCode(latlng) {
    this.geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          this['dirService'].geoCoderReady.next(results[0].formatted_address);
        } else {
          console.log('No results found');
          return null;
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
        return null;
      }
    });
  }

  getUberTiming(lat: number, lng: number): Promise<number> {
    let url = "https://api.thealfredbutler.com/uber?lat=" + lat + "&lng=" + lng;
    return this.http
    .get(url)
    .toPromise().then(res => {
      let data = res.json()['res'];
      if (data) {
        let times = data.times;
        var shortestTime = times[0].estimate;
        for (let time of times) {
          if (time.estimate < shortestTime) {
            shortestTime = time.estimate;
          }
        }
        return Math.ceil(shortestTime / 60);
      } else {
        return -1;
      }
    });
  }

}
