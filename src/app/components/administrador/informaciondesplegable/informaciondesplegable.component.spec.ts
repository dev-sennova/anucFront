import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformaciondesplegableComponent } from './informaciondesplegable.component';

describe('InformaciondesplegableComponent', () => {
  let component: InformaciondesplegableComponent;
  let fixture: ComponentFixture<InformaciondesplegableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformaciondesplegableComponent]
    });
    fixture = TestBed.createComponent(InformaciondesplegableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
