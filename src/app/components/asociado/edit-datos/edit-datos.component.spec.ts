import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDatosComponent } from './edit-datos.component';

describe('EditDatosComponent', () => {
  let component: EditDatosComponent;
  let fixture: ComponentFixture<EditDatosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDatosComponent]
    });
    fixture = TestBed.createComponent(EditDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
