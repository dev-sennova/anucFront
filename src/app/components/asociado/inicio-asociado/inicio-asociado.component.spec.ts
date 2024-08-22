import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioAsociadoComponent } from './inicio-asociado.component';

describe('InicioAsociadoComponent', () => {
  let component: InicioAsociadoComponent;
  let fixture: ComponentFixture<InicioAsociadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InicioAsociadoComponent]
    });
    fixture = TestBed.createComponent(InicioAsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
