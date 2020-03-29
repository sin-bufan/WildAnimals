import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Game8Component } from './game8.component';

describe('Game8Component', () => {
  let component: Game8Component;
  let fixture: ComponentFixture<Game8Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game8Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
