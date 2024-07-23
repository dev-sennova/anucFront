import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeredasComponent } from './veredas.component';

describe('VeredasComponent', () => {
  let component: VeredasComponent;
  let fixture: ComponentFixture<VeredasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VeredasComponent]
    });
    fixture = TestBed.createComponent(VeredasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
