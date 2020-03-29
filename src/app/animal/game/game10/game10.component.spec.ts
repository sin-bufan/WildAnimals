import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Game10Component } from './game10.component';

describe('Game10Component', () => {
  let component: Game10Component;
  let fixture: ComponentFixture<Game10Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game10Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
