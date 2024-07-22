import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoscategoriasComponent } from './productoscategorias.component';

describe('ProductoscategoriasComponent', () => {
  let component: ProductoscategoriasComponent;
  let fixture: ComponentFixture<ProductoscategoriasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductoscategoriasComponent]
    });
    fixture = TestBed.createComponent(ProductoscategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
