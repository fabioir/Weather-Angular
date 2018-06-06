import { TestBed, inject } from '@angular/core/testing';

import { CloudsAndWindService } from './clouds-and-wind.service';

describe('CloudsAndWindService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloudsAndWindService]
    });
  });

  it('should be created', inject([CloudsAndWindService], (service: CloudsAndWindService) => {
    expect(service).toBeTruthy();
  }));
});
