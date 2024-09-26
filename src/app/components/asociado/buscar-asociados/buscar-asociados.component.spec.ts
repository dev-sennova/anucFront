import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarAsociadosComponent } from './buscar-asociados.component';

describe('BuscarAsociadosComponent', () => {
  let component: BuscarAsociadosComponent;
  let fixture: ComponentFixture<BuscarAsociadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarAsociadosComponent]
    });
    fixture = TestBed.createComponent(BuscarAsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
