import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StockData } from '../interfaces/stock';

@Injectable({
  providedIn: 'root',
})
export class StokeService {
  watchlist: StockData[] = [];
  darkMode!: boolean;
  isWishlisted: boolean = false;
  stockData: StockData[] = [];
  constructor(private http: HttpClient) {
    this.initializeWatchList();
    this.intializedThem();
  }

  private url = 'http://localhost:3000/stocks';

  getstockData() {
    return this.http.get<StockData[]>(this.url);
  }

  initializeWatchList() {
    this.watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  }

  intializedThem() {
    this.darkMode = Boolean(localStorage.getItem('darkMode') || 'true');
  }

  // Check if a stock is in the watchlist
  isInWatchList(ticker: string): boolean {
    this.isWishlisted = this.watchlist.some((stock) => stock.ticker === ticker);
    return this.isWishlisted;
  }

  // Add stock to watchlist and update localStorage
  addToWatchList(stock: StockData) {
    const exists = this.isInWatchList(stock.ticker);
    this.watchlist = exists
      ? this.watchlist.filter((item) => item.ticker !== stock.ticker)
      : [...this.watchlist, stock];
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
  }

  toggleTheme() {
    localStorage.setItem('darkMode', this.darkMode.toString());
    return (this.darkMode = !this.darkMode);
  }
}
