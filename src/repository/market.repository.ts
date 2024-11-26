import Endpoints from '@/utils/_static/endpoint';
import baseAxios from '@/utils/common/axios';
import { isEmptyString, isUndefindOrNull } from '@/utils/common/utils';
import { toast } from 'react-toastify';

interface WatchlistForm {
  play_id: string;
  name: string;
  image: File | string;
  asset_list: string[];
}

interface WatchlistFormEdit {
  watchlistId: string;
  asset_list: string[];
}

const marketService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/market/v1`
);

export const getMarketList = async (params: any): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  if (isUndefindOrNull(params) || isEmptyString(params)) {
    return await Promise.resolve(null);
  }

  try {
    const response = await marketService.get(`/list`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const getMarketCurrency = async (): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  return await marketService.get(`/currency`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getAssetOverview = async (id: string): Promise<any> => {
  if (isUndefindOrNull(id) || isEmptyString(id)) {
    return await Promise.reject(new Error('ID is undefined, null, or empty.'));
  }

  const path = Endpoints.asset.getAssetOverview.replace(':id', id);
  return await marketService.get(path, {
    headers: {
      Accept: 'application/json'
    }
  });
};

export const getAssetAnalysis = async (id: string): Promise<any> => {
  if (isUndefindOrNull(id) || isEmptyString(id)) {
    return await Promise.reject(new Error('ID is undefined, null, or empty.'));
  }

  const path = Endpoints.asset.getAssetAnalysis.replace(':id', id);
  return await marketService.get(path, {
    headers: {
      Accept: 'application/json'
    }
  });
};

export const getAssetFinancial = async (
  id: string,
  type: string,
  years: string,
  sort: string
): Promise<any> => {
  if (isUndefindOrNull(id) || isEmptyString(id)) {
    return await Promise.reject(new Error('ID is undefined, null, or empty.'));
  }

  const path = Endpoints.asset.getAssetFinancial.replace(':id', id);
  const params = {
    type,
    years,
    sort
  };
  return await marketService.get(path, {
    params,
    headers: {
      Accept: 'application/json'
    }
  });
};

export const getAssetKeyStat = async (id: string): Promise<any> => {
  if (isUndefindOrNull(id) || isEmptyString(id)) {
    return await Promise.reject(new Error('ID is undefined, null, or empty.'));
  }

  const path = Endpoints.asset.getAssetKeyStat.replace(':id', id);
  return await marketService.get(path, {
    headers: {
      Accept: 'application/json'
    }
  });
};

export const getAssetProfile = async (id: string): Promise<any> => {
  if (isUndefindOrNull(id) || isEmptyString(id)) {
    return await Promise.reject(new Error('ID is undefined, null, or empty.'));
  }

  const path = Endpoints.asset.getAssetProfile.replace(':id', id);
  return await marketService.get(path, {
    headers: {
      Accept: 'application/json'
    }
  });
};

export const getAssetNews = async (id: string): Promise<any> => {
  if (isUndefindOrNull(id) || isEmptyString(id)) {
    return await Promise.reject(new Error('ID is undefined, null, or empty.'));
  }

  const path = Endpoints.asset.getAssetNews.replace(':id', id);
  const params = {
    page: 1,
    limit: 3
  };
  return await marketService.get(path, {
    params,
    headers: {
      Accept: 'application/json'
    }
  });
};

export const getWatchlist = async (params: {
  play_id: string;
}): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }
    return await marketService(`/watchlist`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const getWatchlistById = async (
  id: string,
  currency?: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }
    return await marketService(`/watchlist/${id}`, {
      params: { currency },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const createWatchlist = async (
  formData: WatchlistForm
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.reject(new Error('Access token not found'));
    }
    return await marketService.post(`/watchlist`, formData, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const updateWatchlist = async (
  formData: WatchlistFormEdit
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.reject(new Error('Access token not found'));
    }
    return await marketService.patch(
      `/watchlist/${formData?.watchlistId}`,
      formData,
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

export const deleteWatchlist = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.reject(new Error('Access token not found'));
    }

    return await marketService.delete(`/watchlist/${id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const checkAssetInWatchlist = async (
  watchlistId: string,
  assetId: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.reject(new Error('Access token not found'));
    }

    return await marketService.get(
      `/watchlist/${watchlistId}/watch/${assetId}`,
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

export const addAssetToWatchlist = async (
  watchlistId: string,
  assetId: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.reject(new Error('Access token not found'));
    }

    return await marketService.post(
      `/watchlist/${watchlistId}/watch/${assetId}`,
      {},
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
