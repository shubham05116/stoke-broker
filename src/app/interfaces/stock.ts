export interface Stock {
  volume?: number;
  bid?: number;
  ask?: number;
  last_trade_price?: number;
  number_of_buyers?: number;
  quantity?: number;
}

export interface StockData {
  ticker: string;
  last_trade_price: number;
  data?: Array<Stock>;
}
