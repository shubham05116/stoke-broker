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
  isDarkMode!: boolean;

  constructor(private stokeServices: StokeService) {}

  ngOnInit() {
    this.stokeServices.getstockData().subscribe((data) => {
      this.stokeServices.stockData = data;
      this.originalStockData = [...data];
      if (this.stokeServices.stockData.length > 0) {
        this.selectedStock = this.stokeServices.stockData[0];
      }
      this.stockData = this.stokeServices.stockData;
    });
    this.isDarkMode = this.stokeServices.darkMode;
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
    if (foundStock)
      this.selectedStock =
        this.selectedStock?.ticker === ticker ? null : foundStock;
  }

  addToWatchList(ticker: string) {
    const stock = this.findStock(ticker);
    if (stock) {
      this.stokeServices.addToWatchList(stock);
    }
  }

  isWishList(ticker: string) {
    return this.stokeServices.isInWatchList(ticker);
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
      let i = 0;
      stock.data.forEach((item: any) => {
        item.bid_volume = Math.max(
          0,
          Math.floor(item.bid_volume + Math.random())
        );
        item.ask_volume = Math.max(
          0,
          Math.floor(item.ask_volume + Math.random())
        );
        i++;
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
