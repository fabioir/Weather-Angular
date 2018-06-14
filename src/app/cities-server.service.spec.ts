import { TestBed, inject } from '@angular/core/testing';

import { CitiesServerService } from './cities-server.service';

describe('CitiesServerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CitiesServerService]
    });
  });

  it('should be created', inject([CitiesServerService], (service: CitiesServerService) => {
    expect(service).toBeTruthy();
  }));
});
