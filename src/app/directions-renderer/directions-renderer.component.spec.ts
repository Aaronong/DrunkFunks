import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionsRendererComponent } from './directions-renderer.component';

describe('DirectionsRendererComponent', () => {
  let component: DirectionsRendererComponent;
  let fixture: ComponentFixture<DirectionsRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectionsRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectionsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
