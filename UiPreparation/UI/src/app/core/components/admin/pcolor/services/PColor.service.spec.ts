import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PColorService } from './PColor.service';

describe('PColorService', () => {
  let service: PColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PColorService]
    });
    service = TestBed.inject(PColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

