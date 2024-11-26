export interface ForYouPostI {
  id: string;
  content_text: string;
  media_urls: string[] | null;
  privacy: string;
  is_pinned: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  circle_id: string;
  play_id: string;
  quiz_id: string;
  hashtags: string | null;
  owner: Owner;
  pie_title: string;
  pie_amount: number;
  pie: Pie[];
  total_comment: number;
  total_polling: number;
  total_upvote: number;
  total_downvote: number;
  status_like: boolean;
  status_unlike: boolean;
  status_saved: boolean;
  parent_id: string;
  polling_date: string;
  polling_multiple: boolean;
  polling_new_option: boolean;
  slug: string;
  premium_fee: number;
  status_payment: boolean;
}

export interface Owner {
  avatar: string;
  label: string;
  name: string;
  seeds_tag: string;
  verified: boolean;
}

export interface Pie {
  allocation: number;
  asset_type: string;
  created_at: CreatedAt;
  exchange: string;
  exchange_currency: string;
  exchange_rate: number;
  id: string;
  listed_country: string;
  logo: string;
  name: string;
  price: number;
  price_bar: PriceBar;
  real_ticker: string;
  seeds_ticker: string;
  updated_at: UpdatedAt;
}

export interface CreatedAt {
  seconds: number;
  nanos: number;
}

export interface PriceBar {
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: string;
  volume: number;
  vwap: number;
}

export interface UpdatedAt {
  seconds: number;
  nanos: number;
}

interface IClaims {
  sub: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  name: string;
  seedsTag: string;
  refCode: string;
  avatar: string;
  role: string;
  preferredLanguage: string;
  preferredCurrency: string;
  iss: string;
  aud: string[];
  exp: number;
  nbf: number;
  iat: number;
}

export interface IUserData {
  id: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  name: string;
  seedsTag: string;
  refCode: string;
  avatar: string;
  preferredLanguage: string;
  preferredCurrency: string;
  bio: string;
  pin: boolean;
  followers: number;
  following: number;
  posts: number;
  region: string;
  verified: boolean;
  email_verification: boolean;
  badge: string;
  claims: IClaims;
  refCodeUsage: number;
  label: string;
  currentExp: number;
  isPasswordExists: boolean;
}

export interface IPortfolioSummary {
  asset_id: string;
  play_id: string;
  user_id: string;
  total_lot: number;
  average_price: number;
  current_price: number;
  total_invested: number;
  total_value: number;
  return_value: number;
  return_percentage: number;
  currency: string;
}

export interface AssetI {
  id: string;
  seedsTicker: string;
  realTicker: string;
  logo: string;
  name: string;
  description: string;
  exchange: string;
  exchangeCurrency: string;
  listedCountry: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  assetType: string;
  exchangeRate: number;
  providerName: string;
  providerWebsite: string;
  priceBarHistory: PriceBarHistory[];
  lastPrice: LastPrice;
}

export interface PriceBarHistory {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vwap: number;
  volume: number;
}

export interface LastPrice {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vwap: number;
  volume: number;
}

export interface OverviewData {
  id: string;
  previous_close_price: number;
  open_price: number;
  volume: number;
  average_price: number;
  per: number;
  pbvr: number;
  market_cap: number;
}

export interface AnalysisData {
  id: string;
  buy_point: number;
  hold_point: number;
  sell_point: number;
  buy_price: number;
  hold_price: number;
  sell_price: number;
  performance_1d: number;
  performance_1w: number;
  performance_1m: number;
  performance_3m: number;
  performance_6m: number;
  performance_ytd: number;
  performance_1y: number;
  performance_2y: number;
  performance_5y: number;
}

export interface Banner {
  id: string;
  name: string;
  external_url: string;
  image_url: string;
  type: string;
  title: string;
  description: string;
  tnc: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface Assets {
  id: string;
  ticker: string;
}

export interface SuccessOrderData {
  id: string;
  play_id: string;
  user_id: string;
  asset: AssetCreate;
  type: 'BUY' | 'SELL';
  lot: number;
  bid_price: number;
  stop_loss: number;
  pnl: number;
  created_at: string;
  updated_at: string;
}

interface AssetCreate {
  asset_id: string;
  asset_name: string;
  asset_icon: string;
  asset_ticker: string;
  asset_exchange: string;
  asset_type: string;
}

export interface Hashtag {
  id: string;
  name: string;
}

export interface Participant {
  photo_url: string;
  id: string;
}

export interface CircleThumbnail {
  thumbnailType: 'circle';
  id: string;
  name: string;
  avatar: string;
  cover: string;
  description: string;
  description_rules: string;
  type: string;
  premium_fee: number;
  hashtags: Hashtag;
  total_rating: number;
  total_member: number;
  total_post: number;
}

export interface PlayThumbnail {
  thumbnailType: 'play';
  id: string;
  category: string;
  status: string;
  play_id: string;
  name: string;
  type: string;
  publish_time: string;
  open_registration_time: string;
  play_time: string;
  end_time: string;
  duration: string[];
  min_participant: number;
  max_participant: number;
  currency: number;
  admission_fee: number;
  opening_balance: number;
  gain_percentage: number;
  prize_fix_amount: number;
  prize_pool_amount: number;
  prize_fix_percentages: number[];
  prize_pool_percentages: number[];
  prize_total_amount: number;
  fee_percentage: number;
  participants: Participant;
  total_participants: number;
  is_need_invitation_code: boolean;
  tnc: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  payment_method: string[];
  is_free_voucher_claimed: string;
}

export interface QuizThumbnail {
  thumbnailType: 'quiz';
  id: string;
  circle_category_id: string;
  name: string;
  tnc: string;
  status: string;
  min_participant: number;
  max_participant: number;
  duration_in_minute: number;
  published_at: string;
  started_at: string;
  ended_at: string;
  admission_fee: number;
  category: string;
  prizes: number[];
  winners: string[];
  sponsors: Record<string, unknown>;
  communities: Record<string, unknown>;
  banner: { image_url: string };
  lifelines: Record<string, unknown>;
  participant_lifelines: Record<string, unknown>;
  total_played: number;
  total_questions: number;
  is_joined: boolean;
  is_recommended: boolean;
  participant_status: string;
  participant_user_ids: string[];
  payment_method: string[];
  created_at: string;
}

export interface AssetThumbnail {
  thumbnailType: 'asset';
  id: string;
  seedsTicker: string;
  realTicker: string;
  logo: string;
  name: string;
  description: string;
  exchange: string;
  exchangeCurrency: string;
  listedCountry: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  assetType: string;
  exchangeRate: number;
  providerName: string;
  providerWebsite: string;
  priceBarHistory: PriceBarHistory;
  lastPrice: LastPrice;
}
