import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  StockData } from '../interfaces/stock';

@Injectable({
  providedIn: 'root',
})
export class StokeService {
  constructor(private http: HttpClient) {}
  private url = 'http://localhost:3000/stocks';
  
  getstockData() {
    return this.http.get<StockData[]>(this.url)
  }

}
