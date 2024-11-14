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
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @Input()
  set stock(value: any) {
    this.dataSource = value;
  }
  @Input() isDarkMode!: boolean;

  @Input() stocks!: any;
  constructor(private router: Router) {
  }

  ngOnChanges() {
    console.log(this.stocks);
  }

}
