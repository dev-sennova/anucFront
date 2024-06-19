import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsociadoComponent } from './asociado.component';

describe('AsociadoComponent', () => {
  let component: AsociadoComponent;
  let fixture: ComponentFixture<AsociadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsociadoComponent]
    });
    fixture = TestBed.createComponent(AsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
