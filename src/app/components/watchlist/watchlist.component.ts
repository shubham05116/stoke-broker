import { Component } from '@angular/core';
import { StockData } from 'src/app/interfaces/stock';
import { StokeService } from 'src/app/services/stoke.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent {
  WatchList!: StockData[];
  isDarkMode!: boolean;

  constructor(private stockService: StokeService) {}

  ngOnInit() {
    this.WatchList = this.stockService.watchlist;
    this.isDarkMode = this.stockService.darkMode;
  }

  removeStockFromWatchList(item: string | undefined) {
    this.WatchList = this.WatchList.filter(
      (watchList) => watchList?.ticker !== item
    );
    localStorage.setItem('watchlist', JSON.stringify(this.WatchList));
  }
}
