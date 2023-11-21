import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Permission } from '../models/permission';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.baseUrl}/permission/`);
  }

  getById(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.baseUrl}/permission/${id}`);
  }

  getPermissionsUser(id: any): Observable<Permission> {
    return this.http.get<Permission>(`${this.baseUrl}/permission/user/${id}`);
  }

  setPermissionsUser(params: any, id: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/permission/user/${id}`, params);
  }
}
