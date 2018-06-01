import { TestBed, inject } from '@angular/core/testing';

import { SavedCitiesService } from './saved-cities.service';

describe('SavedCitiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SavedCitiesService]
    });
  });

  it('should be created', inject([SavedCitiesService], (service: SavedCitiesService) => {
    expect(service).toBeTruthy();
  }));
});
