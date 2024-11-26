export interface ListParamsI {
  page: number;
  limit: number;
  search: string;
  status: string;
  level?: string;
}

export interface MetaDataI {
  total: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}

export interface CategoryAcademyI {
  id: string;
  title: string;
  about: {
    en: string;
    id: string;
  };
  banner: string;
  level: [];
  status: string;
  total_class: number;
}

export interface DetailClassI {
  id: string;
  title: string;
  description: {
    en: string;
    id: string;
  };
  price?: {
    idr?: number;
    usd?: number;
  };
  level?: string;
  is_owned: boolean;
  pre_test_score?: number;
  post_test_score?: number;
  banner?: string;
  module?: string;
  video: string;
  total_participants?: number;
  total_question?: number;
}

export interface PriceDataI {
  idr?: number;
  usd?: number;
}

export interface LanguageDataI {
  id: string;
  en: string;
}

export interface SubmitAnswerI {
  class_id: string;
  question_id: string;
  answer_id: string;
}

export interface ParticipantI {
  answer_id: string;
  id: string;
  question_id: string;
  class_id: string;
  answer_lang_id: string;
  answer_lang_en: string;
}

export interface QuestionI {
  id: string;
  class_id: string;
  question_lang_id: string;
  question_lang_en: string;
  participant_id: ParticipantI[];
}

export interface EnrollClassI {
  payment_gateway?: string;
  payment_method?: string;
  phone_number: string;
  promo_code?: string;
  is_use_coins?: boolean;
  is_free_voucher_claimed?: boolean;
}
export interface PaymentStatus {
  orderId: string;
  transactionId: string;
  fraudStatus: string;
  transactionStatus: string;
  currency: string;
  merchantId: string;
  paymentGateway: string;
  itemName: string;
  itemId: string;
  quantity: number;
  grossAmount: number;
  paymentMethod: string;
  vaNumber: string;
  howToPayApi: string;
}

export interface PaymentList {
  admin_fee: number;
  id: string;
  is_active: boolean;
  is_priority: boolean;
  is_promo_available: boolean;
  logo_url: string;
  minimum_withdrawal: number;
  payment_gateway: string;
  payment_method: string;
  payment_type: string;
  service_fee: number;
  promo_price: number;
}

export interface PromoCodeI {
  id: string;
  promo_code: string;
  start_date: string;
  end_date: string;
  discount_percentage: number;
  quantity: number;
  initial_quantity: number;
  institution: string;
}
