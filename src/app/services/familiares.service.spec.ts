import { TestBed } from '@angular/core/testing';

import { FamiliaresService } from './familiares.service';

describe('FamiliaresService', () => {
  let service: FamiliaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamiliaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
