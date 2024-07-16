import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresainfoComponent } from './empresainfo.component';

describe('EmpresainfoComponent', () => {
  let component: EmpresainfoComponent;
  let fixture: ComponentFixture<EmpresainfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresainfoComponent]
    });
    fixture = TestBed.createComponent(EmpresainfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
