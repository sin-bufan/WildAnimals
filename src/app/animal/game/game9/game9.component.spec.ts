import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Game9Component } from './game9.component';

describe('Game9Component', () => {
  let component: Game9Component;
  let fixture: ComponentFixture<Game9Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game9Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
