import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducidoComponent } from './producido.component';

describe('ProducidoComponent', () => {
  let component: ProducidoComponent;
  let fixture: ComponentFixture<ProducidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProducidoComponent]
    });
    fixture = TestBed.createComponent(ProducidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
