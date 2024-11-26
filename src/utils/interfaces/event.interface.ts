export interface EventList {
  created_at: string;
  description: string;
  ended_at: string;
  event_date: string;
  event_price: number;
  event_status: string;
  external_url: string;
  id: string;
  image_url: string;
  is_joined: boolean;
  is_liked: boolean;
  likes: number;
  location_name: string;
  name: string;
  updated_at: string;
  reward: string;
}

export interface BookEvent {
  event_id: string;
  payment_gateway?: string;
  payment_method?: string;
  name: string;
  phone_number: string;
  email: string;
  promo_code?: string;
  is_use_coins?: boolean;
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

export interface ResponseBookFreeEvent {
  id: string;
  order_id: string;
  payment_status: string;
  payment_url: string;
  ticket_status: string;
  va_number: string;
}

export interface TicketData {
  email: string;
  event_id: string;
  id: string;
  name: string;
  notification_type: string[];
  phone_number: string;
  seeds_tag: string;
  status: string;
  ticket_code: string;
  user_id: string;
  check_in_time: string;
  check_out_time: string;
}

export interface CertificateI {
  event_ticket_id: string
  serial_number: string
  user_name: string
  event_name: string
  pdf_data: string
  created_at: string
  updated_at: string
}

export interface MyCertificateI {
  ticket_id: string
  event_name: string
  user_id: string
  created_at: string
}