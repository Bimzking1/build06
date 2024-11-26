export enum TournamentStatus {
  MYPLAY = 'JOINED',
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  PAST = 'PAST',
  CANCELED = 'CANCELED'
}

export enum PortfolioFilter {
  OVERVIEW = 'OVERVIEW',
  CRYPTO = 'CRYPTO',
  ID_STOCK = 'ID_STOCK',
  US_STOCK = 'US_STOCK',
  COMMODITIES = 'COMMODITIES'
}

export enum AssetFilter {
  ID_STOCK = 'ID_STOCK',
  US_STOCK = 'US_STOCK',
  CRYPTO = 'CRYPTO',
  COMMODITIES = 'COMMODITIES'
}

export enum SortingFilter {
  ASCENDING = 'alphabet_asc',
  DESCENDING = 'alphabet_desc',
  TOP_GAINER_PERCENTAGE = 'top_gainers_percentage',
  TOP_GAINER_VALUE = 'top_gainers_value',
  TOP_LOSER_PERCENTAGE = 'top_losers_percentage',
  TOP_LOSER_VALUE = 'top_losers_value'
}

export enum TypeFilter {
  ALL = 'ALL',
  STOCK = 'STOCK',
  US_STOCK = 'US_STOCK',
  ID_STOCK = 'ID_STOCK',
  CRYPTO = 'CRYPTO'
}

export interface ITNC {
  id: string;
  en: string;
}

export interface IParticipants {
  id: string;
  label: string;
  name: string;
  photo_url: string;
  seeds_tag: string;
  total_lose: number;
  total_play: number;
  total_win: number;
  verified: boolean;
  win_rate: number;
}

export interface IDetailTournament {
  id: string;
  banner: string;
  type: string;
  all_category: string[];
  play_id: string;
  fixed_prize: number;
  category: string;
  currency: string;
  name: string;
  prize: number[];
  play_time: string;
  end_time: string;
  sponsorship: Sponsorship;
  community: Community;
  admission_fee: number;
  participant_status: string;
  tnc: ITNC;
  is_joined: boolean;
  participants: IParticipants[];
  total_participants: number;
  max_participant: number;
  is_need_invitation_code: boolean;
  status: string;
}

export interface Sponsorship {
  name: string;
  image_url: string;
}

export interface Community {
  name: string;
  image_url: string;
}

export interface UserInfo {
  avatar: string;
  badge: string;
  bio: string;
  birthDate: string;
  claims: Claim;
  currentExp: number;
  email: string;
  email_verification: string;
  followers: number;
  following: number;
  id: string;
  isPasswordExists: boolean;
  label: string;
  name: string;
  phoneNumber: string;
  pin: boolean;
  posts: number;
  preferredCurrency: string;
  preferredLanguage: string;
  refCode: string;
  refCodeUsage: number;
  region: string;
  seedsTag: string;
  verified: boolean;
}

interface Claim {
  aud: string[];
  avatar: string;
  birthDate: string;
  email: string;
  exp: number;
  iat: number;
  iss: string;
  nbf: string;
  phoneNumber: string;
  preferredCurrency: string;
  preferredLanguage: string;
  refCode: string;
  role: string;
  seedsTag: string;
  sub: string;
}

export interface BallanceTournament {
  balance: number;
  portfolio: number;
  total_sell: number;
  total_buy: number;
  currency: string;
  return_value: number;
  return_percentage: number;
}

export interface ChartProportion {
  asset_ticker: string;
  percentage: number;
}

export interface AssetDetail {
  asset_type: string;
  exchange_currency: string;
  listed_country: string;
  logo: string;
  name: string;
  real_ticker: string;
  seeds_ticker: string;
}

export interface ActiveAsset {
  asset_detail: AssetDetail;
  asset_id: string;
  average_price: number;
  currency: string;
  id: string;
  play_id: string;
  return_percentage: number;
  total_lot: number;
}

export interface PostData {
  circle: undefined;
  circle_id: string;
  content_text: string;
  created_at: string;
  id: string;
  is_pinned: string;
  media_urls: MediaURL[];
  owner: Owner;
  parent_id: string;
  pie: Pie;
  pie_amount: number;
  pie_title: string;
  play_id: string;
  polling_date: string;
  polling_multiple: boolean;
  polling_new_option: boolean;
  premium_fee: number;
  privacy: string;
  status_like: boolean;
  status_payment: boolean;
  status_saved: boolean;
  status_unlike: boolean;
  total_comment: number;
  totaldownvote: number;
  total_polling: number;
  total_upvote: number;
  updated_at: string;
  user_id: string;
}

export interface MediaURL {
  index: string;
}

interface Owner {
  avatar: string;
  name: string;
  seeds_tag: string;
  verified: boolean;
}

export interface Pie {
  allocation: number;
  asset_type: string;
  exchange: string;
  exchange_currency: string;
  exchange_rate: number;
  id: string;
  listed_country: string;
  logo: string;
  name: string;
  price: number;
  price_bar: {
    close: number;
    high: number;
    low: number;
    open: number;
    timestamp: string;
    volume: number;
    vwap: number;
  };
  real_ticker: string;
  seeds_ticker: string;
}

export interface Participant {
  photo_url: string;
  id: string;
  verified: false;
  label: string;
  name: string;
  seeds_tag: string;
  total_play: number;
  total_win: number;
  total_lose: number;
  win_rate: number;
}

export interface SponsorCom {
  name: string;
  image_url: string;
}
export interface TopTournament {
  id: string;
  play_id: string;
  name: string;
  category: string;
  all_category: string[];
  type: string;
  publish_time: string;
  open_registration_time: string;
  play_time: string;
  end_time: string;
  min_participant: number;
  max_participant: number;
  currency: string;
  opening_balance: number;
  admission_fee: number;
  fee_percentage: number;
  gain_percentage: number;
  prize_fix_amount: number;
  prize_fix_percentages: number[];
  prize_pool_amount: number;
  prize_pool_percentages: number[];
  participants: Participant[];
  is_joined: boolean;
  created_by_user_id: string;
  created_by_admin_id: string;
  status: string;
  tnc: string;
  banner: string;
  rank: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
  sponsorship: SponsorCom[];
  featured_link: string;
  reward_url: string;
  promo_id: string;
  is_need_invitation_code: boolean;
  payment_method: string[];
  is_free_voucher_claimed: boolean;
  }
export type MarketAssetI = AssetListI[];

export interface AssetListI {
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
  exchangeRate: number;
  assetSubType?: string[];
  priceBar: PriceBar;
}

export interface PriceBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vwap: number;
  volume: number;
}

export interface Summary {
  value: number;
  gnl: number;
  gnl_percentage: number;
  currency: string;
}