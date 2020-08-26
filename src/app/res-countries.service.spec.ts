import { TestBed } from '@angular/core/testing';

import { ResCountriesService } from './res-countries.service';

describe('ResCountriesService', () => {
  let service: ResCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
