export interface Stock {
  volume?: any;
  bid?: any;
  ask?: any;
  ask_volume?: any;
  bid_volume?: any;
  quantity?: any;
}

export interface StockData {
  ticker: string;
  company: string;
  price: number;
  percent_change: number;
  net_change: number;
  bid: number;
  ask: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  close: number;
  bid_volume?: number;
  ask_volume?: number;
  data?: OrderBookEntry[];
}

interface OrderBookEntry {
  bid: number;
  ask: number;
  bid_volume: number;
  ask_volume: number;
}
