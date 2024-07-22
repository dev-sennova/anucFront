import { TestBed } from '@angular/core/testing';

import { VeredasService } from './veredas.service';

describe('VeredasService', () => {
  let service: VeredasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeredasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
