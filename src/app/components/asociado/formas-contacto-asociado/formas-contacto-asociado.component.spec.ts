import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormasContactoAsociadoComponent } from './formas-contacto-asociado.component';

describe('FormasContactoAsociadoComponent', () => {
  let component: FormasContactoAsociadoComponent;
  let fixture: ComponentFixture<FormasContactoAsociadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormasContactoAsociadoComponent]
    });
    fixture = TestBed.createComponent(FormasContactoAsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
