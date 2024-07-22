import { TestBed } from '@angular/core/testing';

import { ProductosCategoriasService } from './productos-categorias.service';

describe('ProductosCategoriasService', () => {
  let service: ProductosCategoriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductosCategoriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
