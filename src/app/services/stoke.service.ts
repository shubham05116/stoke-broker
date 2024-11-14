import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StockData } from '../interfaces/stock';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StokeService {
  private watchlistSubject = new BehaviorSubject<StockData[]>([]);
  watchlist$ = this.watchlistSubject.asObservable();

  get watchlist(): StockData[] {
    return this.watchlistSubject.value;
  }

  set watchlist(value: StockData[]) {
    this.watchlistSubject.next(value);
  }

  darkMode!: boolean;
  isWishlisted: boolean = false;
  stockData: StockData[] = [];
  private readonly RAPID_API_KEY =
    'fd87c9764fmshe8627a9b68e3056p1b3885jsna6bb6acc88ac';
  private readonly BASE_URL =
    'https://indian-s-api2.p.rapidapi.com/BSE_most_active';

  constructor(private http: HttpClient) {
    // this.initializeWatchList();
    this.getWatchList(this.stockData);
    this.intializedThem();
  }

  private baseUrl = 'http://localhost:3000';

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }

  // You can add other API endpoints here
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }


  logout(token: string) {
    console.log('Sending logout request with token:', token); // Debug log
    return this.http.post(`${this.baseUrl}/logout`, { token }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add token to headers if required
      })
    });
  } 

  getWatchlistFromAPI(token: string) {
    
    return this.http.get(`${this.baseUrl}/watchlist`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  getWatchList(stockData: StockData[]) {
    const token = localStorage.getItem('token');
    if (stockData.length > 0 && token) {
      this.getWatchlistFromAPI(token).subscribe({
        next: (tickers: any) => {
          console.log('API response tickers:', tickers.watchlist);
          const updatedWatchlist = stockData.filter((stock) =>
            tickers.watchlist.includes(stock.ticker)
          );
          console.log('Updated watchlist:', updatedWatchlist);
          this.watchlist = updatedWatchlist;
        },
        error: (error) => {
          console.error('Error fetching watchlist:', error);
        },
      });
    }
  }

  getstockData() {
    const headers = new HttpHeaders({
      'x-rapidapi-key': this.RAPID_API_KEY,
      'x-rapidapi-host': 'indian-stock-exchange-api2.p.rapidapi.com',
    });

    return this.http.get<StockData[]>(this.BASE_URL, { headers });
  }

  // initializeWatchList() {
  //   this.watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  // }

  intializedThem() {
    this.darkMode = Boolean(localStorage.getItem('darkMode') || 'true');
  }

  // Check if a stock is in the watchlist
  isInWatchList(ticker: string): boolean {
    this.isWishlisted = this.watchlist.some((stock) => stock.ticker === ticker);
    return this.isWishlisted;
  }

  addToWatchListAPI(ticker: string): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(
      `${this.baseUrl}/addwatchlist`,
      { ticker },
      { headers }
    );
  }

  removeFromWatchListAPI(ticker: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(
      `${this.baseUrl}/removewatchlist`,
      { ticker },
      { headers }
    );
  }

  removeFromWatchList(ticker: string | undefined) {
    if (!ticker) return;
    
    this.removeFromWatchListAPI(ticker).subscribe({
      next: (response) => {
        const updatedWatchlist = this.watchlist.filter((stock) => stock.ticker !== ticker);
        this.watchlist = updatedWatchlist;
        this.getWatchList(this.stockData);
      },
      error: (error) => {
        console.error('Error removing from watchlist:', error);
      }
    });
  }

  toggleTheme() {
    localStorage.setItem('darkMode', this.darkMode.toString());
    return (this.darkMode = !this.darkMode);
  }

  addToWatchList(stock: StockData) {
    const exists = this.isInWatchList(stock.ticker);
    if (!exists) {
      this.addToWatchListAPI(stock.ticker).subscribe({
        next: (response) => {
          const updatedWatchlist = [...this.watchlist, stock];
          this.watchlist = updatedWatchlist;
          this.getWatchList(this.stockData);
        },
        error: (error) => {
          console.error('Error updating watchlist:', error);
        },
      });
    } else {
      this.removeFromWatchList(stock.ticker);
    }
  }
}
