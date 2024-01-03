import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { blockNavigationIfChangeGuard } from './block-navigation-if-change.guard';

describe('blockNavigationIfChangeGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => blockNavigationIfChangeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
