import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Stock, StockData } from 'src/app/interfaces/stock';

@Component({
  selector: 'app-stoke-table',
  templateUrl: './stoke-table.component.html',
  styleUrls: ['./stoke-table.component.css'],
})
export class StokeTableComponent {
  displayedColumns: string[] = ['BidVol', 'Bid', 'Ask', 'AskVol'];
  dataSource: MatTableDataSource<Stock> = new MatTableDataSource<Stock>();
  @Input()
  set stock(value: any) {
    this.dataSource = value;
  }
  @Input() isDarkMode!: boolean;

  @Input() stocks!: StockData;
  constructor(private router: Router) {}

  detailsPageHandler(item: string) {
    this.router.navigate(['/details'], { queryParams: { stock: item } });
  }
}
