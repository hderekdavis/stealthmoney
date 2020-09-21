import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatedTaxesComponent } from './estimated-taxes.component';

describe('EstimatedTaxesComponent', () => {
  let component: EstimatedTaxesComponent;
  let fixture: ComponentFixture<EstimatedTaxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimatedTaxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimatedTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
