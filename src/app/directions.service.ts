import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";

@Injectable()
export class DirectionsService {

  private getDirections = new Subject<Object>();
  private fetchedDirections = new Subject<boolean>();

  constructor() { }

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

}
