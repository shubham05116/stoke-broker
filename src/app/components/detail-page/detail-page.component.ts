import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Stock, StockData } from 'src/app/interfaces/stock';
import { StokeService } from 'src/app/services/stoke.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css'],
})
export class DetailPageComponent implements OnInit {
  selectedStock: StockData[] = [];
  dataSource: MatTableDataSource<Stock> = new MatTableDataSource<Stock>();
  displayedColumns: string[] = ['Bid', 'Price', 'Ask'];
  isDarkMode!: boolean;

  constructor(
    private stockService: StokeService,
    @Inject(MAT_DIALOG_DATA) public data: { stock: StockData },
    private dialogRef: MatDialogRef<DetailPageComponent>
  ) {}

  ngOnInit() {
    this.selectedStock = [this.data.stock];
    this.setData();
    
    setInterval(() => {
      this.randomizeData();
      this.setData();
    }, 4000);

    this.isDarkMode = this.stockService.darkMode;
  }

  closeDialog(): void {
    this.dialogRef.close();
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

  randomizeData() {
    if (this.selectedStock.length > 0 && this.selectedStock[0]?.data) {
      this.selectedStock[0].data.forEach((item: any) => {
        const bidVolumeChange = item.bid_volume * (0.4 * Math.random() - 0.2);
        const askVolumeChange = item.ask_volume * (0.4 * Math.random() - 0.2);

        const MAX_VOLUME = 1000000;
        item.bid_volume = Math.min(MAX_VOLUME, Math.max(0, Math.floor(item.bid_volume + bidVolumeChange)));
        item.ask_volume = Math.min(MAX_VOLUME, Math.max(0, Math.floor(item.ask_volume + askVolumeChange)));
      });
    }
  }
}
