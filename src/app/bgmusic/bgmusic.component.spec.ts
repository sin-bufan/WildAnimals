import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BgmusicComponent } from './bgmusic.component';

describe('BgmusicComponent', () => {
  let component: BgmusicComponent;
  let fixture: ComponentFixture<BgmusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BgmusicComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BgmusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
