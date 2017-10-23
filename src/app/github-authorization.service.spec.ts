import { TestBed, inject } from '@angular/core/testing';

import { GithubAuthorizationService } from './github-authorization.service';

describe('GithubAuthorizationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GithubAuthorizationService]
    });
  });

  it('should be created', inject([GithubAuthorizationService], (service: GithubAuthorizationService) => {
    expect(service).toBeTruthy();
  }));
});
