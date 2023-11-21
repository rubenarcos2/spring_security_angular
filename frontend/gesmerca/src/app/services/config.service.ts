import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Config } from '../models/config';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Config[]>(`${this.baseUrl}/config`).pipe(
      map(result => {
        if (String(result) != '[]') sessionStorage.setItem('generalConfig', JSON.stringify(result));
        return result;
      })
    );
  }

  getAllConfigsOfUser(id: any) {
    return this.http.get<Config[]>(`${this.baseUrl}/config/user/${id}`).pipe(
      map(result => {
        if (String(result) != '[]') sessionStorage.setItem('userConfig', JSON.stringify(result));
        return result;
      })
    );
  }

  getAllUsersOfConfig(id: any) {
    return this.http.get<Config[]>(`${this.baseUrl}/config/${id}/users`).pipe(
      map(result => {
        return result;
      })
    );
  }

  getById(id: any) {
    return this.http.get<Config>(`${this.baseUrl}/config/${id}`);
  }

  create(params: any) {
    return this.http.post(`${this.baseUrl}/config/create`, params);
  }

  update(params: any) {
    return this.http.post(`${this.baseUrl}/config/update/`, params);
  }

  updateUserConfig(params: any, id: any) {
    return this.http.post(`${this.baseUrl}/config/user/update/${id}`, params);
  }

  delete(params: any) {
    return this.http.post(`${this.baseUrl}/config/delete`, params);
  }

  deleteUserConfig(params: any, id: any) {
    return this.http.post(`${this.baseUrl}/config/user/delete/${id}`, params);
  }

  hasConfig(confg: string) {
    let configs: Config[] = JSON.parse(sessionStorage.getItem('generalConfig') as string);
    let config: Config = configs?.filter(conf => conf.name == confg)[0];
    return config?.value;
  }

  hasUserConfig(config: string) {
    let userConfigs: Config[] = JSON.parse(sessionStorage.getItem('userConfig') as string);
    let userConfig: Config = userConfigs?.filter(conf => conf.name == config)[0];
    return userConfig?.pivot.value;
  }

  get isUserConfigLoaded() {
    return sessionStorage.getItem('userConfig') != null;
  }
}
