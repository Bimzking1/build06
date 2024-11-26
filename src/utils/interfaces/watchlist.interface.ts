export interface Watchlist {
  id: string;
  name: string;
  userId?: string;
  play_id: string;
  imgUrl: string;
  createdAt?: string;
  assetList?: DetailAsset[];
}

export interface AssetWatchlist {
  watchlist: Watchlist;
}

export interface DetailAsset {
  id: string;
  seedsTicker: string;
  realTicker: string;
  logo: string;
  name: string;
  exchange: string;
  exchangeCurrency: string;
  listedCountry: string;
  createdAt: string;
  updatedAt: string;
  assetType: string;
  priceBar: Pricebar;
}

export interface Pricebar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vwap: number;
  volume: number;
}

export interface WatchlistForm {
  play_id: string;
  name: string;
  image: File | string;
  asset_list: string[];
}