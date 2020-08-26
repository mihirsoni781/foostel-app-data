import { TestBed } from '@angular/core/testing';

import { FoostelservicesService } from './foostelservices.service';

describe('FoostelservicesService', () => {
  let service: FoostelservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoostelservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
