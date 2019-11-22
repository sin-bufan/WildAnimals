import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalPage } from './animal.page';

describe('AnimalPage', () => {
  let component: AnimalPage;
  let fixture: ComponentFixture<AnimalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
