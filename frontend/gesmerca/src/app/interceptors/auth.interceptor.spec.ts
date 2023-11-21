import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('AuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      providers: [AuthInterceptor, HttpClient, HttpHandler],
    })
  );

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
