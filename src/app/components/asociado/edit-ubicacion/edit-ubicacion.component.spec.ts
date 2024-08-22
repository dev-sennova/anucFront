import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUbicacionComponent } from './edit-ubicacion.component';

describe('EditUbicacionComponent', () => {
  let component: EditUbicacionComponent;
  let fixture: ComponentFixture<EditUbicacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUbicacionComponent]
    });
    fixture = TestBed.createComponent(EditUbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
