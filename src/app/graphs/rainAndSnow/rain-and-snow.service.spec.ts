import { TestBed, inject } from '@angular/core/testing';

import { RainAndSnowService } from './rain-and-snow.service';

describe('RainAndSnowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RainAndSnowService]
    });
  });

  it('should be created', inject([RainAndSnowService], (service: RainAndSnowService) => {
    expect(service).toBeTruthy();
  }));
});
