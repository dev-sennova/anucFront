import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarproductosComponent } from './gestionarproductos.component';

describe('GestionarproductosComponent', () => {
  let component: GestionarproductosComponent;
  let fixture: ComponentFixture<GestionarproductosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionarproductosComponent]
    });
    fixture = TestBed.createComponent(GestionarproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
