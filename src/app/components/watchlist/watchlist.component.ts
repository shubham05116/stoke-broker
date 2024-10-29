import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockData } from 'src/app/interfaces/stock';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent {
    watchList: any[] = [];
  
    constructor(private route: ActivatedRoute) {}
  
    ngOnInit() {
      console.log(this.route);
    }
  }
