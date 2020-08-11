import { TestBed } from '@angular/core/testing';

import { PlaidGuardService } from './plaid-guard.service';

describe('PlaidGuardService', () => {
  let service: PlaidGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaidGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
