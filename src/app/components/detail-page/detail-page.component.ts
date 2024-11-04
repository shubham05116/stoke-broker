import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Stock, StockData } from 'src/app/interfaces/stock';
import { StokeService } from 'src/app/services/stoke.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css'],
})
export class DetailPageComponent implements OnInit {
  selectedStock: StockData[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Bid', 'Price', 'Ask'];
  isDarkMode!: boolean;


  constructor(
    private stockService: StokeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const stock = params['stock'];
      this.selectedStock = this.stockService.stockData.filter((stockData) => {
        return stockData.ticker === stock;
      });
      this.setData();
    });
    this.isDarkMode = this.stockService.darkMode;
  }

  setData() {
    if (this.selectedStock.length > 0 && this.selectedStock) {
      const data = this.selectedStock[0]?.data || [];
      const mergedData: any[] = [];
      const totalRows = data.length * 2;

      for (let i = 0; i < totalRows; i++) {
        if (i < data.length) {
          const index = data.length - 1 - i;

          mergedData.push({
            bid: '',
            price: data[index].ask,
            ask: data[index].ask_volume,
          });
        } else {
          const index = i - data.length;
          mergedData.push({
            bid: data[index].bid_volume,
            price: data[index].bid,
            ask: '',
          });
        }
      }
      this.dataSource.data = mergedData;
    }
  }
}
