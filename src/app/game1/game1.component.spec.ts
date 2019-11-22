import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Game1Component } from './game1.component';

describe('Game1Component', () => {
  let component: Game1Component;
  let fixture: ComponentFixture<Game1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game1Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
