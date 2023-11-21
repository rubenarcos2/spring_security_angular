import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GoodsReceipt } from '../models/goodsreceipt';
import { Observable, map } from 'rxjs';
import { GoodsReceiptProduct } from '../models/goodsreceiptproduct';

@Injectable({
  providedIn: 'root',
})
export class GoodsreceiptService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(param?: any): Observable<GoodsReceipt[]> {
    return this.http.get<GoodsReceipt[]>(`${this.baseUrl}/goodsreceipt?${param}`).pipe(
      map(result => {
        return result;
      })
    );
  }

  getAllNoPaginated(param?: any): Observable<GoodsReceipt[]> {
    return this.http.get<GoodsReceipt[]>(`${this.baseUrl}/goodsreceipt/all`).pipe(
      map(result => {
        return result;
      })
    );
  }

  getById(id: any): Observable<GoodsReceipt> {
    return this.http.get<GoodsReceipt>(`${this.baseUrl}/goodsreceipt/${id}`);
  }

  getPriceEst(params: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/goodsreceipt/getPriceEst`, params);
  }

  getProducts(id: any): Observable<GoodsReceiptProduct[]> {
    return this.http.get<GoodsReceiptProduct[]>(`${this.baseUrl}/goodsreceipt/${id}/products`);
  }

  addProduct(params: any, id: any): Observable<any> {
    return this.http.post<GoodsReceiptProduct>(
      `${this.baseUrl}/goodsreceipt/${id}/product/add`,
      params
    );
  }

  deleteProduct(params: any, id: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/goodsreceipt/${id}/product/delete`, params);
  }

  create(params: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/goodsreceipt/create`, params);
  }

  update(params: any, id: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/goodsreceipt/update/${id}`, params);
  }

  delete(params: any, id: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/goodsreceipt/delete/${id}`, params);
  }
}
