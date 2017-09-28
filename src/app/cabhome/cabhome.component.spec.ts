import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabhomeComponent } from './cabhome.component';

describe('CabhomeComponent', () => {
  let component: CabhomeComponent;
  let fixture: ComponentFixture<CabhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
