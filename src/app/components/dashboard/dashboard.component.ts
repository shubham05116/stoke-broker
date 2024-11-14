import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { StockData } from 'src/app/interfaces/stock';
import { StokeService } from 'src/app/services/stoke.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DetailPageComponent } from '../detail-page/detail-page.component';
import { HttpClient } from '@angular/common/http';

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
  WatchList!: StockData[];

  constructor(
    private stokeServices: StokeService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.stokeServices.watchlist$.subscribe(watchlist => {
      console.log('Watchlist updated:', watchlist);
      this.WatchList = watchlist;
    });

    this.stokeServices.getstockData().subscribe((data) => {
      this.stokeServices.stockData = this.enrichStockData(data);
      this.originalStockData = [...this.stokeServices.stockData];
      if (this.stokeServices.stockData.length > 0) {
        this.selectedStock = this.stokeServices.stockData[0];
      }
      this.stockData = this.stokeServices.stockData;
      this.stokeServices.getWatchList(this.stockData);
    });

    this.isDarkMode = this.stokeServices.darkMode;
    this.intervalId = setInterval(() => {
      this.updateStockData();
    }, 5000);
  }

  openDialog(ticker: string) {
    const stockData = this.findStock(ticker);
    const dialogRef = this.dialog.open(DetailPageComponent, {
      width: '80%',
      height: '80%',
      data: { stock: stockData },
      panelClass: this.isDarkMode ? 'dark-theme-dialog' : 'light-theme-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleTheme() {
    this.stokeServices.darkMode = !this.stokeServices.darkMode;
    this.isDarkMode = this.stokeServices.darkMode;
    console.log('fggfg', this.stockData);
  }

  detailsPageHandler(item: string) {
    this.router.navigate(['/details'], { queryParams: { stock: item } });
  }

  showTableData(ticker: string) {
    const foundStock = this.findStock(ticker);
    if (foundStock) {
      this.selectedStock = foundStock;
    }
  }

  addToWatchList(ticker: string) {
    const stock = this.findStock(ticker);
    if (stock) {
      this.stokeServices.addToWatchList(stock);
      this.WatchList = this.stokeServices.watchlist;
      this.stokeServices.getWatchList(this.stockData);
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
  removeStockFromWatchList(ticker: string | undefined) {
    this.stokeServices.removeFromWatchList(ticker);
    this.WatchList = this.stokeServices.watchlist;
    this.stokeServices.getWatchList(this.stockData);
  }

  private findStock(ticker: string): StockData | undefined {
    return this.stockData.find((stock) => stock.ticker === ticker);
  }

  trackByTicker(index: number, stock: StockData) {
    return stock.ticker;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Check if click is inside search area or filtered data
    const isSearchBar = target.classList.contains('search-bar');
    const isFilteredData = target.closest('.filtered-data-section');
    const isMenuButton = target.closest('button');
    const isActionButton = target.closest('.stock-btn');

    // Don't clear if clicking within these areas
    if (!isSearchBar && !isFilteredData && !isMenuButton && !isActionButton) {
      this.searchTerm = '';
      this.filterStocks();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.WatchList, event.previousIndex, event.currentIndex);
  }

  private enrichStockData(data: StockData[]): StockData[] {
    return data.map((stock) => ({
      ...stock,
      bid_volume: Math.floor(stock.volume * Math.random() * 0.1), // 10% of volume
      ask_volume: Math.floor(stock.volume * Math.random() * 0.1), // 10% of volume
      data: this.generateOrderBookData(stock),
    }));
  }

  private generateOrderBookData(stock: StockData) {
    return Array.from({ length: 5 }, (_, i) => ({
      bid: stock.bid != null ? Number((stock.bid - i * 0.05).toFixed(2)) : 0.0,
      ask: stock.ask != null ? Number((stock.ask + i * 0.05).toFixed(2)) : 0.0,
      bid_volume:
        stock.bid != null ? Math.floor(stock.volume * Math.random() * 0.1) : 0,
      ask_volume:
        stock.ask != null ? Math.floor(stock.volume * Math.random() * 0.1) : 0,
    }));
  }

  private updateStockData() {
    this.stockData = this.stockData.map((stock) => ({
      ...stock,
      data: this.generateOrderBookData(stock),
    }));
  }

  logout(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.stokeServices.logout(token).subscribe({
        next: (response) => {
          console.log('Logout successful:', response);
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Logout failed:', error);
          alert('Error during logout');
        },
      });
    } else {
      alert('No token available for logout');
    }
  }
}
