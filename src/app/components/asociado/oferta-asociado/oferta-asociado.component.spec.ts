import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaAsociadoComponent } from './oferta-asociado.component';

describe('OfertaAsociadoComponent', () => {
  let component: OfertaAsociadoComponent;
  let fixture: ComponentFixture<OfertaAsociadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfertaAsociadoComponent]
    });
    fixture = TestBed.createComponent(OfertaAsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
