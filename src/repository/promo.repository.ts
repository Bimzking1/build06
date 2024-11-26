import baseAxios from '@/utils/common/axios';

const promoService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/promo-code/v1/`
);

export const promoValidate = async (params: any): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  return await promoService.get(`/validate`, {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getPromocodeActive = async (
  page: number,
  limit: number,
  featureType?: string,
  featureId?: string,
  totalTransaction?: number
): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  try {
    const response = await promoService.get('/list/active', {
      params: {
        page,
        limit,
        feature_type: featureType,
        feature_id: featureId,
        total_transaction: totalTransaction
      },
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
