import { TestBed, inject } from '@angular/core/testing';

import { ForecastValuesService } from './forecast-values.service';

describe('ForecastValuesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForecastValuesService]
    });
  });

  it('should be created', inject([ForecastValuesService], (service: ForecastValuesService) => {
    expect(service).toBeTruthy();
  }));
});
