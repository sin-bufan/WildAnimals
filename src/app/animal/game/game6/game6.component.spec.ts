import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Game6Component } from './game6.component';

describe('Game6Component', () => {
  let component: Game6Component;
  let fixture: ComponentFixture<Game6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game6Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
