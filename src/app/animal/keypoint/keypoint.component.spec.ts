import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeypointComponent } from './keypoint.component';

describe('KeypointComponent', () => {
  let component: KeypointComponent;
  let fixture: ComponentFixture<KeypointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeypointComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeypointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
