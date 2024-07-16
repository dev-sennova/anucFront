import { TestBed } from '@angular/core/testing';

import { EmpresaGlobalesService } from './empresa-globales.service';

describe('EmpresaGlobalesService', () => {
  let service: EmpresaGlobalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpresaGlobalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
