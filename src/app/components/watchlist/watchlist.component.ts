import { Component } from '@angular/core';
import { StokeService } from 'src/app/services/stoke.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent {
  WatchList = this.stockService.watchlist;
  isDarkMode = this.stockService.darkMode;

  constructor(private stockService: StokeService) {}

  ngOnInit() {
    this.WatchList = JSON.parse(localStorage.getItem('watchlist') || '[]');
    this.stockService.watchlist = this.WatchList;
    console.log(this.WatchList);
  }

  removeStockFromWatchList(item: string | undefined) {
    this.WatchList = this.WatchList.filter(
      (watchList) => watchList?.ticker !== item
    );
    localStorage.setItem('watchlist', JSON.stringify(this.WatchList));
  }
}
