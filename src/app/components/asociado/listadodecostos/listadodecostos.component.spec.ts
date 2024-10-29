import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadodecostosComponent } from './listadodecostos.component';

describe('ListadodecostosComponent', () => {
  let component: ListadodecostosComponent;
  let fixture: ComponentFixture<ListadodecostosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadodecostosComponent]
    });
    fixture = TestBed.createComponent(ListadodecostosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
