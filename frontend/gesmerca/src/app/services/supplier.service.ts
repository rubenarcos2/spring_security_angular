import { Injectable } from '@angular/core';
import { Supplier } from '../models/supplier';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(param?: any): Observable<Supplier[]> {
    if (param)
      return this.http.get<Supplier[]>(`${this.baseUrl}/supplier?${param}`).pipe(
        map(result => {
          return result;
        })
      );
    else
      return this.http.get<Supplier[]>(`${this.baseUrl}/supplier`).pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllNoPaginated(param?: any): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/supplier/all`).pipe(
      map(result => {
        return result;
      })
    );
  }

  getById(id: any): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/supplier/${id}`);
  }

  create(params: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/supplier/create`, params);
  }

  update(params: any): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.put(`${this.baseUrl}/supplier/update`, params, { headers });
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/supplier/delete/${id}`);
  }
}
