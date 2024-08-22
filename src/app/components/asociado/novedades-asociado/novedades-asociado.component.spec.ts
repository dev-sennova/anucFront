import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadesAsociadoComponent } from './novedades-asociado.component';

describe('NovedadesAsociadoComponent', () => {
  let component: NovedadesAsociadoComponent;
  let fixture: ComponentFixture<NovedadesAsociadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NovedadesAsociadoComponent]
    });
    fixture = TestBed.createComponent(NovedadesAsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
