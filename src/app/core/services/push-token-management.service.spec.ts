import { TestBed } from '@angular/core/testing';

import { PushTokenManagementService } from './push-token-management.service';

describe('PushTokenManagementService', () => {
  let service: PushTokenManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushTokenManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
