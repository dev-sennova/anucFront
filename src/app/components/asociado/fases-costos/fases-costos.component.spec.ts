import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FasesCostosComponent } from './fases-costos.component';

describe('FasesCostosComponent', () => {
  let component: FasesCostosComponent;
  let fixture: ComponentFixture<FasesCostosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FasesCostosComponent]
    });
    fixture = TestBed.createComponent(FasesCostosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
