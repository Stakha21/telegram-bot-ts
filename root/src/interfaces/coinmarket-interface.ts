export interface Quote {
  [index: string]: number | string;
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  last_updated: string;
}

export interface CoinList {
  name: string;
  symbol: string;
  quote: {
    USD: Quote;
  };
}

export interface Coin {
  [symbol: string]: {
    name: string;
    symbol: string;
    quote: {
      USD: Quote;
    };
  };
}
