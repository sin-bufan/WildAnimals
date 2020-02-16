import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GibbonComponent } from './gibbon.component';

describe('GibbonComponent', () => {
  let component: GibbonComponent;
  let fixture: ComponentFixture<GibbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GibbonComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
