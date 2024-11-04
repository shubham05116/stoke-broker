export interface Stock {
  volume?: number;
  bid?: number;
  ask?: number;
  ask_volume?: number;
  bid_volume?: number;
  quantity?: number;
}

export interface StockData {
  ticker: string;
  last_trade_price: number;
  data?: Array<Stock>;
}
