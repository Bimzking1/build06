import { isGuest } from '@/helpers/guest';
import baseAxios from '@/utils/common/axios';
import { isEmptyString, isUndefindOrNull } from '@/utils/common/utils';

const authService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/circle/v1`
);
const circleService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/circle/v2/`
);

export const getTrendingCircle = async (): Promise<any> => {
  try {
    let response = await authService.get('/trending');
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const getCircleLeaderBoard = async (): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!isGuest() && (accessToken === null || accessToken === '')) {
    return await Promise.resolve('Access token not found');
  }

  return await circleService.get(`/list/leaderboard`, {
    headers: {
      Accept: 'application/json',
      Authorization: isGuest() ? '' : `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getCircle = async (params: any): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!isGuest() && (accessToken === null || accessToken === '')) {
    return await Promise.resolve('Access token not found');
  }

  if (isUndefindOrNull(params) || isEmptyString(params)) {
    return await Promise.resolve(null);
  }

  return await circleService.get(`/list`, {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: isGuest() ? '' : `Bearer ${accessToken ?? ''}`
    }
  });
};

export const createCircle = async (formRequest: any): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  return await circleService.post(`/create`, formRequest, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const updateCircle = async (
  formRequest: any,
  circleId: string
): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  return await circleService.put(`/update/${circleId}`, formRequest, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getCircleCategories = async (params: any): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!isGuest() && (accessToken === null || accessToken === '')) {
    return await Promise.resolve('Access token not found');
  }

  if (isUndefindOrNull(params) || isEmptyString(params)) {
    return await Promise.resolve(null);
  }

  return await circleService.get(`/categories`, {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: isGuest() ? '' : `Bearer ${accessToken ?? ''}`
    }
  });
};

export const deleteCircle = async (circleId: string): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  if (isUndefindOrNull(circleId) || isEmptyString(circleId)) {
    return await Promise.resolve(null);
  }

  return await circleService.delete(`/delete/${circleId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const leaveCircle = async (circleId: string): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  if (isUndefindOrNull(circleId) || isEmptyString(circleId)) {
    return await Promise.resolve(null);
  }

  return await circleService.delete(`/user/leave?circle_id=${circleId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getCircleBalance = async (): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  return await circleService.get(`/balances`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getCircleIncome = async (params: any): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  if (isUndefindOrNull(params) || isEmptyString(params)) {
    return await Promise.resolve(null);
  }

  return await circleService.get(`/incomes`, {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getCircleTransactionIn = async (params: any): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  if (isUndefindOrNull(params) || isEmptyString(params)) {
    return await Promise.resolve(null);
  }

  return await circleService.get(`/transactions/in`, {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getCircleTransactionOut = async (params: any): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  if (isUndefindOrNull(params) || isEmptyString(params)) {
    return await Promise.resolve(null);
  }

  return await circleService.get(`/transactions/out`, {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const withdrawCircle = async (formRequest: any): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    let response = await circleService.post(`/withdraws`, formRequest, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const likeCircle = async (circleId: string): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  return await circleService.post(
    `/like/${circleId}`,
    { id: circleId },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    }
  );
};
