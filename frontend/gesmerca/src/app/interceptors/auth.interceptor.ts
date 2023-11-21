import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /*
   * Intercepts all HTTP requests added a Bearer token
   *
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authUser = this.authService.getAuthUser();
    if (authUser && authUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });
    }
    return next.handle(request);
  }
}
