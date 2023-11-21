import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CheckSessionService } from './check-session.service';

describe('CheckSessionService', () => {
  let service: CheckSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(CheckSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
