import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { CheckSessionService } from './check-session.service';
import TokenUtils from '../utils/tokenUtils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _baseUrl = environment.baseUrl;
  private _user!: User;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private checkSessionService: CheckSessionService
  ) {}

  login(data: User) {
    return this.http.post(`${this._baseUrl}/auth/login`, data).pipe(
      map(result => {
        sessionStorage.setItem('authUser', JSON.stringify(result));
        let tokenDecode = JSON.parse(JSON.stringify(result)).token;
        tokenDecode = JSON.parse(atob(tokenDecode.split('.')[1]));
        this.checkSessionService.startResetIdleTimer();
        this.checkSessionService.startCheckSession();
        return tokenDecode;
      })
    );
  }

  refresh(data: any) {
    return this.http.post(`${this._baseUrl}/auth/refresh`, data).pipe(
      map(result => {
        sessionStorage.setItem('authUser', JSON.stringify(result));
        if (!this.checkSessionService.isCheckSessionActive())
          this.checkSessionService.startCheckSession();
        return result;
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this._baseUrl}/auth/register`, data);
  }

  profile() {
    return this.http.get(`${this._baseUrl}/auth/user-profile`).pipe(
      map(result => {
        let res = JSON.parse(JSON.stringify(result));
        this._user = res.user;
        this._user.roles = res.roles;
        this._user.permissions = res.permissions;
        sessionStorage.setItem('permissionUser', JSON.stringify(res.permissions));
        if (!this.checkSessionService.isCheckSessionActive())
          this.checkSessionService.startCheckSession();
        return result;
      })
    );
  }

  logout() {
    this.checkSessionService.stopCheckSession();
    this.checkSessionService.stopIdleTimer();

    return this.http.get(`${this._baseUrl}/auth/logout`).pipe(
      map(() => {
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('userConfig');
        sessionStorage.removeItem('permissionUser');
      })
    );
  }

  getAuthUser() {
    return JSON.parse(sessionStorage.getItem('authUser') as string);
  }

  getAllUsers() {
    return this.http.get(`${this._baseUrl}/auth/users`);
  }

  hasRole(rol: string) {
    if (this.user !== undefined) return this._user.roles?.find(r => r.roleName == rol);
    else return false;
  }

  hasPermission(permission: string) {
    //if (this.user !== undefined) return this._user.permissions?.find(p => p.name == permission);
    //else return false;
    return JSON.parse(sessionStorage.getItem('permissionUser') as string)?.find(
      (p: { permissionName: string }) => p.permissionName == permission
    );
  }

  get isLoggedIn() {
    return sessionStorage.getItem('authUser');
  }

  get user() {
    return this._user;
  }
}
