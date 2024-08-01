import { TestBed } from '@angular/core/testing';

import { ParentescosService } from './parentescos.service';

describe('ParentescosService', () => {
  let service: ParentescosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentescosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
