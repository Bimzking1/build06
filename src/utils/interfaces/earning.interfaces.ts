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

export interface Experience {
  currentExp: number;
  currentTier: string;
  expExpiration: string;
  nextExp: number;
  tierList: TierList[];
}

interface TierList {
  exp: number;
  image: string;
  name: string;
  rewards: Rewards[];
}

interface Rewards {
  description: string;
  name: string;
}

export interface Result {
  balance: number;
  created_at: string;
  id: string;
  updated_at: string;
}
