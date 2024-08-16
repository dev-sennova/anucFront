import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarNucleoFamiliarComponent } from './gestionar-nucleo-familiar.component';

describe('GestionarNucleoFamiliarComponent', () => {
  let component: GestionarNucleoFamiliarComponent;
  let fixture: ComponentFixture<GestionarNucleoFamiliarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionarNucleoFamiliarComponent]
    });
    fixture = TestBed.createComponent(GestionarNucleoFamiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
