import { TestBed } from '@angular/core/testing';

import { TiposPredioService } from './tipos-predio.service';

describe('TiposPredioService', () => {
  let service: TiposPredioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposPredioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
