import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionAnucAsociadoComponent } from './informacion-anuc-asociado.component';

describe('InformacionAnucAsociadoComponent', () => {
  let component: InformacionAnucAsociadoComponent;
  let fixture: ComponentFixture<InformacionAnucAsociadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformacionAnucAsociadoComponent]
    });
    fixture = TestBed.createComponent(InformacionAnucAsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
