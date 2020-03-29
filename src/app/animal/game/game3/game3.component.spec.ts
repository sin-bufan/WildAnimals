import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Game3Component } from './game3.component';

describe('Game3Component', () => {
  let component: Game3Component;
  let fixture: ComponentFixture<Game3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game3Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
