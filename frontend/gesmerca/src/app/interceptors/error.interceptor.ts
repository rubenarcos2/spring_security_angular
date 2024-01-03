import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isLoggedOut: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        //General server error
        if (error?.status > 500 && error?.status < 600) {
          sessionStorage.clear();
          //location.replace('/login');
          this.router.navigate(['login']);
          return throwError(() => 'Se ha producido un error en el servidor');
        }

        if (!this.isLoggedOut) {
          this.isLoggedOut = true;
          //Local logout if 440 expired session response returned from api. Token has expired
          if (error?.status === 440) {
            sessionStorage.clear();
            //location.replace('/login?expired=true');
            this.router.navigate(['login'], {
              queryParams: { expired: 'true' },
            });
            return throwError(() => 'Se ha expirado la sesión');
          }

          //Auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          if (error?.status === 401 || error?.status === 403) {
            this.authService.logout().subscribe({
              next: () => {
                //location.replace('/login');
                this.router.navigate(['login']);
              },
              error: error => {
                sessionStorage.clear();
                return throwError(() => error?.error?.error);
              },
            });
          }
          if (error?.status === 422) {
            return throwError(() => 'No se ha podido procesar la petición');
          }
        }
        return throwError(() => error?.error?.error);
      })
    );
  }
}
