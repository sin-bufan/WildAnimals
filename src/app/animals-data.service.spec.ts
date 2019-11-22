import { TestBed } from '@angular/core/testing';

import { AnimalsDataService } from './animals-data.service';

describe('AnimalsDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnimalsDataService = TestBed.get(AnimalsDataService);
    expect(service).toBeTruthy();
  });
});
