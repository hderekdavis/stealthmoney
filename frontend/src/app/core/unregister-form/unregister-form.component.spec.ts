import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisterFormComponent } from './unregister-form.component';

describe('UnregisterFormComponent', () => {
  let component: UnregisterFormComponent;
  let fixture: ComponentFixture<UnregisterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnregisterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
