import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MenuService {

  subject = new Subject<boolean>();

  constructor() { }

  get menu$(): Observable<boolean> {
    return this.subject.asObservable();
  }

  open() {
    this.subject.next(true);
  }

  close() {
    this.subject.next(false);
  }
}
