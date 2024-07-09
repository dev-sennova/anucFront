import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadogeneralComponent } from './listadogeneral.component';

describe('ListadogeneralComponent', () => {
  let component: ListadogeneralComponent;
  let fixture: ComponentFixture<ListadogeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadogeneralComponent]
    });
    fixture = TestBed.createComponent(ListadogeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
