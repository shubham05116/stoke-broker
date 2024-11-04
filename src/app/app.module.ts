import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { StokeService } from './services/stoke.service';
import { StokeTableComponent } from './components/stoke-table/stoke-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { RouterModule } from '@angular/router';
import { DetailPageComponent } from './components/detail-page/detail-page.component';

@NgModule({
  declarations: [AppComponent, StokeTableComponent, DashboardComponent, WatchlistComponent, DetailPageComponent],
  imports: [BrowserModule, FormsModule ,AppRoutingModule, HttpClientModule ,MatIconModule, MatTableModule, MatSortModule, BrowserAnimationsModule , RouterModule],
  providers: [StokeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
