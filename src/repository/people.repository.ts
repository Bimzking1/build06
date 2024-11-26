import baseAxios from '@/utils/common/axios';

const authService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/user/v1`
);

export const searchUser = async (params: any): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    let response = await authService.get(`/search`, {
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

export const verifiedUser = async (): Promise<any> => {
  try {
    const response = await authService.get('/verified?page=1&limit=7');
    return (response.data = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const trendingUser = async (): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    const response = await authService.get('/trending?page=1&limit=15', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return (response.data = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

// circleService.get(`/list`, {
//     params,
//     headers: {
//       Accept: 'application/json',
//       Authorization: `Bearer ${accessToken ?? ''}`
//     }
//   });
