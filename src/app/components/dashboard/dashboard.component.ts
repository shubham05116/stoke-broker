import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockData } from 'src/app/interfaces/stock';
import { StokeService } from 'src/app/services/stoke.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  stockData: StockData[] = [];
  filteredData: StockData[] = [];
  originalStockData: StockData[] = [];
  selectedStock: StockData | null = null;
  searchTerm: string = '';
  intervalId: any;
  isDarkMode: boolean = true;

  constructor(private stokeServices: StokeService) {}

  ngOnInit() {
    this.stokeServices.getstockData().subscribe((data) => {
      this.stockData = data;
      this.originalStockData = [...data];
      if (this.stockData.length > 0) {
        this.selectedStock = this.stockData[0];
      }
    });
    this.intervalId = setInterval(() => this.randomizeData(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  toggleTheme() {
    this.stokeServices.darkMode = !this.stokeServices.darkMode;
    this.isDarkMode = this.stokeServices.darkMode;
  }

  showTableData(ticker: string) {
    const foundStock = this.findStock(ticker);
    if (this.selectedStock && this.selectedStock.ticker === ticker) {
      this.selectedStock = null;
    } else if (foundStock) {
      this.selectedStock = foundStock;
    }
  }

  addToWatchList(ticker: string) {
    const stock = this.findStock(ticker);
    if (stock) {
      const exists = this.stokeServices.watchlist.some(
        (item) => item.ticker === ticker
      );
      this.stokeServices.watchlist = exists
        ? this.stokeServices.watchlist.filter((item) => item.ticker !== ticker)
        : [...this.stokeServices.watchlist, stock];

       localStorage.setItem('watchlist', JSON.stringify(this.stokeServices.watchlist));

    }
  }

  isInWatchList(ticker: string): boolean {
    return this.stokeServices.watchlist.some(
      (stock) => stock.ticker === ticker
    );
  }

  filterStocks() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = term
      ? this.originalStockData.filter((stock) =>
          stock.ticker.toLowerCase().includes(term)
        )
      : (this.filteredData = []);
  }

  randomizeData() {
    this.stockData.forEach((stock: any) => {
      stock.data.forEach((item: any) => {
        item.bid_volume = Math.max(
          0,
          Math.floor(item.volume + (Math.random() * 1000 - 500))
        );
        item.ask_volume = Math.max(
          0,
          Math.floor(item.volume + (Math.random() * 500 - 1000))
        );
      });
    });
  }

  private findStock(ticker: string): StockData | undefined {
    return this.stockData.find((stock) => stock.ticker === ticker);
  }

  trackByTicker(index: number, stock: StockData) {
    return stock.ticker;
  }
}
