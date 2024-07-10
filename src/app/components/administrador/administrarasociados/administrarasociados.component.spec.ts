import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarasociadosComponent } from './administrarasociados.component';

describe('AdministrarasociadosComponent', () => {
  let component: AdministrarasociadosComponent;
  let fixture: ComponentFixture<AdministrarasociadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministrarasociadosComponent]
    });
    fixture = TestBed.createComponent(AdministrarasociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
