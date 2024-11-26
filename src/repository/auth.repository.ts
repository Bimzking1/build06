import Endpoints from '@/utils/_static/endpoint';
import baseAxios from '@/utils/common/axios';
import { isEmptyString, isUndefindOrNull } from '@/utils/common/utils';
import type { AuthFormData } from '@/utils/interfaces/auth.interface';
import { type SearchUserChat } from '@/utils/interfaces/chat.interface';
import type {
  IGetOtp,
  IVerifyOtp
} from '@/utils/interfaces/payload.interfaces';
import { type SearchUserParams } from '@/utils/interfaces/user.interface';
import { toast } from 'react-toastify';

const authService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/auth/v1/`
);

const userService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/user/v1/`
);

interface LoginForm {
  phoneNumber: string;
  password: string;
  platform?: string;
  os_name?: string;
}

interface LoginSSOForm {
  identifier: string;
  provider: string;
}

interface RegistForm {
  phoneNumber: string;
  birthDate: string;
  name: string;
  seedsTag: string;
  refCode: string;
  password: string;
  provider: {
    provider: string;
    identifier: string;
  };
}

interface IChangePassword {
  phoneNumber: string;
  oldPassword: string;
  password: string;
}

interface LoginGuestResponse {
  status: number;
}

interface IQuickLogin {
  phone_number: string;
  method: string;
  otp: string;
}
interface IQuickRegister {
  phone_number: string;
  name: string;
  method?: string;
  otp?: string;
}

export const loginPhoneNumber = async (formData: LoginForm): Promise<any> => {
  try {
    let response = await authService.post('login/phone-number', formData);
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const loginGuest = async (): Promise<LoginGuestResponse> => {
  const response = { status: 200 };
  return response;
};

export const loginSSO = async ({
  identifier,
  provider
}: LoginSSOForm): Promise<any> => {
  try {
    let response = await authService.post(`login/${provider}`, { identifier });
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};
export const linkSSO = async ({
  identifier,
  provider
}: LoginSSOForm): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }
    let response = await authService.post(
      `login/${provider}`,
      { identifier },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const register = async (formData: RegistForm): Promise<any> => {
  try {
    let response = await authService.post('create', formData);
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    console.log(error);
    return await Promise.resolve(null);
  }
};

export const forgotPassword = async (
  formData: IChangePassword
): Promise<any> => {
  try {
    let response = await userService.patch('change-password', formData);
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const changePassword = async (
  formData: IChangePassword
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }
    return await userService.patch(`change-password`, formData, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const checkEmail = async (email: string): Promise<any> => {
  const response = await authService.get(`validate/email?email=${email}`);
  return response.data;
};

export const checkPhoneNumber = async (phoneNumber: string): Promise<any> => {
  const response = await authService.get(`validate/phone?phone=${phoneNumber}`);
  return response.data;
};

export const validateSetupPassword = async (
  phoneNumber: string
): Promise<any> => {
  const response = await userService.get(
    `validate/account-password?phone_number=${phoneNumber}`
  );
  return response;
};

export const quickLogin = async (payload: IQuickLogin): Promise<any> => {
  try {
    if (
      payload?.phone_number?.length === 0 ||
      payload?.method?.length === 0 ||
      payload?.otp?.length === 0
    ) {
      return await Promise.resolve(null);
    }
    return await authService.post(`quick-account/login`, {
      ...payload
    });
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const quickRegister = async (payload: IQuickRegister): Promise<any> => {
  try {
    if (
      payload?.phone_number?.length === 0 ||
      payload?.name?.length === 0 ||
      payload?.method?.length === 0 ||
      payload?.otp?.length === 0
    ) {
      return await Promise.resolve(null);
    }
    return await authService.post(`quick-account/create`, {
      ...payload
    });
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const editGuestInfo = async (formData: AuthFormData): Promise<any> => {
  try {
    const accessToken = formData.token;

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    const { token, ...formDataWithoutToken } = formData;

    const response = await userService.patch('', formDataWithoutToken, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return { ...response, status: 200 };
  } catch (error: any) {
    return error.response;
  }
};

export const checkSeedsTag = async (seedsTag: string): Promise<any> => {
  const response = await authService.get(
    `validate/seeds-tag?seeds-tag=${seedsTag}`
  );
  return response.data;
};
export const checkRefCode = async (refCode: string): Promise<any> => {
  const response = await authService.get(
    `validate/ref-code?ref-code=${refCode}`
  );
  return response.data;
};
export const getRefreshToken = async (): Promise<any> => {
  const refreshToken = localStorage.getItem('refreshToken');
  const keepMeLoggedIn = localStorage.getItem('keepMeLoggedIn');

  if (
    refreshToken === null ||
    refreshToken === '' ||
    refreshToken === 'undefined'
  ) {
    return await Promise.resolve('Refresh token not found');
  } else if (keepMeLoggedIn === null || keepMeLoggedIn === 'false') {
    return await Promise.resolve('Please Login again');
  }

  return await authService.post('refresh', {
    refreshToken
  });
};

export const postResetPassword = async (email: string): Promise<any> => {
  if (typeof email !== 'string') {
    return await Promise.resolve(null);
  }
  return await authService.post(`email/v1/forgot-password`, { email });
};

export const getOtp = async (payload: IGetOtp): Promise<any> => {
  try {
    if (
      typeof payload.method !== 'string' ||
      typeof payload.phoneNumber !== 'string'
    ) {
      return await Promise.resolve(null);
    }
    return await authService.put(`/otp`, { ...payload });
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};

export const verifyOtp = async (payload: IVerifyOtp): Promise<any> => {
  try {
    if (
      payload?.method?.length === 0 ||
      payload?.msisdn?.length === 0 ||
      payload?.otp?.length === 0
    ) {
      return await Promise.resolve(null);
    }
    return await authService.post(`/otp/verify/${payload.method}`, {
      ...payload
    });
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const editVerifyOtp = async (payload: IVerifyOtp): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }
    if (
      payload?.method?.length === 0 ||
      payload?.msisdn?.length === 0 ||
      payload?.otp?.length === 0
    ) {
      return await Promise.resolve(null);
    }
    return await authService.post(
      `/otp/verify/${payload.method}`,
      {
        ...payload
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const loginProvider = async (
  identifier: string,
  provider: string
): Promise<any> => {
  try {
    let response = await authService.post(`login/${provider}`, { identifier });

    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const avatarList = async (gender: string = 'male'): Promise<any> => {
  if (isUndefindOrNull(gender) || isEmptyString(gender)) {
    return await Promise.resolve(null);
  }

  return await authService.get(`/avatars?gender=${gender}`);
};

export const registerNewUser = async (formData: {
  phoneNumber: string;
  email?: string;
  birthDate: string;
  name: string;
  seedsTag: string;
  refCode: string;
  password: string;
  avatar?: string;
  provider: {
    provider: string;
    identifier: string;
  };
}): Promise<any> => {
  try {
    return await authService.post(`/create`, formData);
  } catch (error) {
    console.log(error);
    return await Promise.resolve(null);
  }
};

export const searchUser = async ({
  search = '',
  page = 1,
  limit = 20
}: SearchUserParams): Promise<{ result: SearchUserChat[] } | null> => {
  const accessToken = localStorage.getItem('accessToken');
  const path = Endpoints.user.search;

  if (isUndefindOrNull(accessToken)) {
    return await Promise.resolve(null);
  }

  return await userService.get(path, {
    params: { search, page, limit },
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};
