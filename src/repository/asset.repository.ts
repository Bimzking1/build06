import baseAxios from '@/utils/common/axios';
import { isEmptyString, isUndefindOrNull } from '@/utils/common/utils';

const devUrl =
  process?.env?.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance';
const authService = baseAxios(`${devUrl}/asset/v1`);
const authCircle = baseAxios(`${devUrl}/circle/v1`);
const authPeople = baseAxios(`${devUrl}/user/v1`);
const assetService = baseAxios(
  `${process.env.NEXT_PUBLIC_URL ?? devUrl}/asset/v1/`
);
const circleService = baseAxios(
  `${process.env.NEXT_PUBLIC_URL ?? devUrl}/circle/v1/`
);
// const peopleService = baseAxios(
//   `${process.env.NEXT_PUBLIC_URL ?? devUrl}/user/v1/`
// );
const tournamentService = baseAxios(
  `${process.env.NEXT_PUBLIC_URL ?? devUrl}/play/v1/`
);
const marketService = baseAxios(
  `${process.env.NEXT_PUBLIC_URL ?? devUrl}/market/v1/`
);

export const getTrendingAssets = async (params: {
  page: number;
  limit: number;
  sortBy: string;
  search: string;
  currency: string;
}): Promise<any> => {
  try {
    let response = await authService.get('/trending', {
      params
    });
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const getTrendingCircle = async (params: {
  page: number;
  limit: number;
}): Promise<any> => {
  try {
    let response = await authCircle.get('/trending', {
      params
    });
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const getTrendingPeople = async (params: {
  page: number;
  limit: number;
  is_cache_enabled: boolean;
}): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    let response = await authPeople.get('/trending', {
      params,
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

export const assetTop = async (params: any): Promise<any> => {
  if (isUndefindOrNull(params) || isEmptyString(params)) {
    return await Promise.resolve(null);
  }

  return await assetService.get(`/trending`, {
    params,
    headers: {
      Accept: 'application/json'
    }
  });
};

export const circleTop = async (): Promise<any> => {
  return await circleService.get(`/trending`, {
    headers: {
      Accept: 'application/json'
    }
  });
};

export const tournamentTop = async (): Promise<any> => {
  return await tournamentService.get(`/trending`, {
    headers: {
      Accept: 'application/json'
    }
  });
};

export const assetAll = async (params: any): Promise<any> => {
  if (isUndefindOrNull(params) || isEmptyString(params)) {
    return await Promise.resolve(null);
  }

  return await assetService.get(`/search`, {
    params,
    headers: {
      Accept: 'application/json'
    }
  });
};

export const getAssetById = async (id: string): Promise<any> => {
  if (isUndefindOrNull(id) || isEmptyString(id)) {
    return await Promise.resolve(null);
  }

  return await marketService.get(`/single/${id}`, {
    headers: {
      Accept: 'application/json'
    }
  });
};

export const getDetailAsset = async (id: string, params: any): Promise<any> => {
  if (isUndefindOrNull(id) || isEmptyString(id)) {
    return await Promise.resolve(null);
  }

  return await marketService.get(`/single/${id}`, {
    params,
    headers: {
      Accept: 'application/json'
    }
  });
};
