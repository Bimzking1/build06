import baseAxios from '@/utils/common/axios';
import { isUndefindOrNull } from '@/utils/common/utils';

interface IRequestWithdraw {
  payment_method: string;
  account_name: string;
  account_number: string;
  nett_amount: number;
  fee: number;
}

const earningService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/my-earning/v1`
);

const withdrawService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/withdraw/v1`
);

export const getEarningBalance = async (currency: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await earningService.get(`/balance`, {
      params: {
        currency
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.reject(error);
  }
};

export const getEarningHistory = async (params: {
  limit: number;
  page: number;
  currency: string;
}): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.reject(new Error('Access token not found'));
    }
    return await earningService.get(`/history`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.reject(error);
  }
};

export const requestWithdraw = async (body: IRequestWithdraw): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }
    if (
      isUndefindOrNull(body?.account_name) ||
      isUndefindOrNull(body?.account_number) ||
      isUndefindOrNull(body?.fee) ||
      isUndefindOrNull(body?.nett_amount) ||
      isUndefindOrNull(body?.payment_method)
    ) {
      return await Promise.resolve(null);
    }

    const response = await withdrawService.post(`/request`, body, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });

    return response;
  } catch (error) {
    await Promise.reject(error);
  }
};

export const getWithdrawalStatus = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await withdrawService.get(`/${id}/status`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.reject(error);
  }
};
