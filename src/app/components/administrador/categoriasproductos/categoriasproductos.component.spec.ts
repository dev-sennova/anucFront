import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasproductosComponent } from './categoriasproductos.component';

describe('CategoriasproductosComponent', () => {
  let component: CategoriasproductosComponent;
  let fixture: ComponentFixture<CategoriasproductosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriasproductosComponent]
    });
    fixture = TestBed.createComponent(CategoriasproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
