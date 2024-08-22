import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPasswordAsociadoComponent } from './edit-password-asociado.component';

describe('EditPasswordAsociadoComponent', () => {
  let component: EditPasswordAsociadoComponent;
  let fixture: ComponentFixture<EditPasswordAsociadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPasswordAsociadoComponent]
    });
    fixture = TestBed.createComponent(EditPasswordAsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
