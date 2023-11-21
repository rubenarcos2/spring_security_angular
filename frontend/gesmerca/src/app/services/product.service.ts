import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { Observable, map } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(param?: any) {
    return this.http.get<Product[]>(`${this.baseUrl}/product?${param}`).pipe(
      map(result => {
        return result;
      })
    );
  }

  getAllNoPaginated(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/product/all`).pipe(
      map(result => {
        return result;
      })
    );
  }

  getById(id: any) {
    return this.http.get<Product>(`${this.baseUrl}/product/${id}`);
  }

  create(params: any) {
    return this.http.post(`${this.baseUrl}/product/create`, params);
  }

  update(params: any) {
    const headers = new HttpHeaders();
    return this.http.post(`${this.baseUrl}/product/update/`, params, { headers });
  }

  delete(params: any) {
    return this.http.post(`${this.baseUrl}/product/delete`, params);
  }
}
