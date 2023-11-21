import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Role[]>(`${this.baseUrl}/role/`);
  }

  getById(id: any) {
    return this.http.get<Role>(`${this.baseUrl}/role/${id}`);
  }

  getRoleUser(id: any) {
    return this.http.get<Role>(`${this.baseUrl}/role/user/${id}`);
  }

  setRoleUser(params: any, id: any) {
    return this.http.post(`${this.baseUrl}/role/user/${id}`, params);
  }

  create(params: any) {
    return this.http.post(`${this.baseUrl}/role/create`, params);
  }

  update(params: any, id: any) {
    return this.http.post(`${this.baseUrl}/role/update/${id}`, params);
  }

  delete(params: any, id: any) {
    return this.http.post(`${this.baseUrl}/role/delete/${id}`, params);
  }
}
