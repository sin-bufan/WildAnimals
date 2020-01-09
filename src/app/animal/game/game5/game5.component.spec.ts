import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Game5Component } from './game5.component';

describe('Game5Component', () => {
  let component: Game5Component;
  let fixture: ComponentFixture<Game5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game5Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
