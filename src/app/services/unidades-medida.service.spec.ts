import { TestBed } from '@angular/core/testing';

import { UnidadesMedidaService } from './unidades-medida.service';

describe('UnidadesMedidaService', () => {
  let service: UnidadesMedidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnidadesMedidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
