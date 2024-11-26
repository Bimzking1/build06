export interface IFormMethod {
  email?: string;
  phoneNumber?: string;
  method: 'email' | 'phoneNumber';
}

export interface IOTPMethod {
  whatsapp?: string;
  sms?: string;
  method: 'whatsapp' | 'sms';
}

export interface IOTPHandler {
  status?: boolean;
  otp?: string;
}

export interface ICreateNewPassword {
  password: string;
  rePassword: string;
}

export interface Provider {
  provider: string;
  identifier: string;
}

export interface IRegisterFormdata {
  countryCode: string;
  phoneNumber: string;
  email: string;
  birthdate: string;
  name: string;
  seedsTag: string;
  referralCode: string;
  otp: string;
  password: string;
  rePassword: string;
  avatar: string;
  providers: Provider;
}
