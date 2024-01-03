import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  /*
   * Allows or denies access to a route based on the url and component path
   *
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn) {
      // check if route is restricted by role
      const { permission } = route.data;
      if (permission && !this.authService.hasPermission(String(permission))) {
        // role not authorized so redirect to home page
        this.router.navigate(['/']);
        this.toastr.warning('Usuario no autorizado');
        return false;
      }
      return true;
    }
    // user not logged so redirect to home page
    this.router.navigate(['/']);
    this.toastr.warning('Acceso restringido');
    return false;
  }
}
