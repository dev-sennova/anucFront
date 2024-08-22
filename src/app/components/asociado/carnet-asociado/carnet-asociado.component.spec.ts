import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarnetAsociadoComponent } from './carnet-asociado.component';

describe('CarnetAsociadoComponent', () => {
  let component: CarnetAsociadoComponent;
  let fixture: ComponentFixture<CarnetAsociadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarnetAsociadoComponent]
    });
    fixture = TestBed.createComponent(CarnetAsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
