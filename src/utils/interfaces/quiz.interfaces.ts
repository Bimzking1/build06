export interface JoinQuizI {
  quiz_id: string;
  lifelines: string[];
  language: string;
  payment_gateway: string;
  payment_method: string;
  phone_number: string;
  promo_code: string;
  invitation_code: string;
  is_use_coins: boolean;
  success_url?: string;
  cancel_url?: string;
}

export enum QuizStatus {
  MYQUIZ = 'MYQUIZ',
  PUBLISHED = 'PUBLISHED',
  STARTED = 'STARTED',
  ENDED = 'ENDED',
  CANCELED = 'CANCELED'
}

export interface QuizListParamsDTO {
  search?: string;
  limit: number;
  page: number;
  status: QuizStatus | '';
  currency: string;
}

export interface LifelinesI {
  name: LifelinesEnum;
  price: number;
}

export interface ParticipantLifeline {
  name: LifelinesEnum;
  price: number;
  is_used: boolean;
}

export interface ITNC {
  id: string;
  en: string;
}

export interface IDetailQuiz {
  id: string;
  circle_category_id: string;
  name: string;
  tnc: ITNC;
  status: string;
  min_participant: number;
  max_participant: number;
  duration_in_minute: number;
  published_at: Date;
  started_at: Date;
  ended_at: Date;
  admission_fee: number;
  category: string;
  prizes: number[];
  winners: string[];
  sponsors: any;
  communities: any;
  banner: any;
  participant_lifelines: ParticipantLifeline[] | null;
  lifelines: LifelinesI[];
  total_played: number;
  total_questions: number;
  is_joined: boolean;
  participant_status: string;
  created_at: Date;
  is_need_invitation_code: boolean;
  quiz_unique_id: string;
  prize_type: string;
  winner_link_url: string[];
  winner_image_url: string[];
  payment_method: string;
}

export const initialDetailQuiz = {
  id: '',
  circle_category_id: '',
  name: '',
  tnc: {
    id: '',
    en: ''
  },
  status: '',
  min_participant: 0,
  max_participant: 0,
  duration_in_minute: 0,
  published_at: new Date(),
  started_at: new Date(),
  ended_at: new Date(),
  admission_fee: 0,
  category: '',
  prizes: [],
  winners: [],
  sponsors: [],
  communities: [],
  banner: '',
  participant_lifelines: [],
  participant_status: '',
  total_played: 0,
  total_questions: 0,
  is_joined: false,
  created_at: new Date(),
  lifelines: []
};

export interface ITopQuiz {
  id: string;
  name: string;
  banner: any;
  questions: number;
}

export interface IQuiz {
  id: string;
  name: string;
  banner: any;
  questions: number;
  participants: number;
  started_at: Date;
  ended_at: Date;
  admission_fee: number;
  is_played: boolean;
  status: string;
  quiz_unique_id: string;
}

export interface IQuizSettings {
  soundEffect: boolean;
  vibrateEffect: boolean;
}

export enum LifelinesEnum {
  '50_50' = '50_50',
  'PHONE' = 'PHONE',
  'VOTE' = 'VOTE'
}

export interface SubmitAnswerI {
  quiz_id: string;
  question_id: string;
  answer_id: number;
}

export interface QuestionI {
  id: string;
  quiz_participant_id: string;
  quiz_question_id: string;
  answer_id: number;
  is_correct: boolean;
  data: QuestionDataI;
  difficulty: string;
}

export interface QuestionDataI {
  en: Answer;
  id: Answer;
  is_correct?: boolean;
}

export interface Answer {
  question: string;
  question_image: string;
  question_video: string;
  options: Options;
  option_image: Options;
  description?: string;
}

export interface Options {
  option_1: Option;
  option_2: Option;
  option_3: Option;
  option_4: Option;
}

export interface Option {
  id: number;
  option: string;
  is_correct?: boolean;
}

export interface LifelineRespI {
  option_id: number;
  percentage: number;
  question_id: string;
}

export interface LifelineReqI {
  quiz_id: string;
  lifeline_name: LifelinesEnum;
  question_id: string;
}

export interface UseLifelineState {
  lifeline: LifelinesEnum;
  res: LifelineRespI[];
}

export interface CircleTrendingI {
  id: string;
  image: string;
  banner: string;
  name: string;
  totalMember: number;
  totalRating: number;
}

export interface ScoreI {
  score: number;
  rank: number;
  started_at: Date;
  ended_at: Date;
}

export interface QuizReviewDTO {
  data: QuizReviewDataI[];
  score: number;
  rank: number;
  started_at: string;
  ended_at: string;
}

export interface QuizReviewDataI {
  id: string;
  quiz_participant_id: string;
  quiz_question_id: string;
  answer_id: number;
  is_correct: boolean;
  data: QuestionDataI;
  started_at: string;
  ended_at: string;
}

export interface QuizCashoutI {
  quiz_id: string;
  method: string;
  account_name: string;
  account_number: string;
  beneficiary_name: string;
}

export interface QuizCashoutRespI {
  id: string;
  user_id: string;
  method: string;
  account_name: string;
  account_number: string;
  reference_number: string;
  description: string;
  admin_fee: number;
  promo_price: number;
  service_fee: number;
  raw_amount?: number;
  created_at: string;
  updated_at: string;
}
export interface QuizCategoryI {
  category_id: string;
  name: string;
  descriptions: {
    id: string;
    en: string;
  };
}

export interface ImageBanner {
  image_link: string;
  image_url: string;
}
export interface TopQuiz {
  id: string;
  quiz_unique_id: string;
  name: string;
  banner: ImageBanner;
  questions: number;
  participants: number;
  category: string;
  status: string;
  admission_fee: number;
  is_played: boolean;
  is_recommended: boolean;
  is_free_voucher_claimed: boolean;
  started_at: string;
  ended_at: string;
  created_at: string;
}

export interface DailyQuizRes {
  participant_id: string;
  is_played: boolean;
  data: Data;
}

export interface Data {
  id: string;
  difficulty: string;
  is_correct: boolean;
  answer_id: number;
  daily_quiz: DailyQuiz;
}

export interface DailyQuiz {
  en: Questions;
  id: Questions;
}

export interface Questions {
  question: string;
  options: DailyQuizOptions;
  option_image: DailyQuizOptions;
  description: string;
}

export interface DailyQuizOptions {
  option_1: OptionI;
  option_2: OptionI;
  option_3: OptionI;
  option_4: OptionI;
}
export interface OptionI {
  id: number;
  option: string;
}