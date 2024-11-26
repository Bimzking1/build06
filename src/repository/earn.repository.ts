import baseAxios from '@/utils/common/axios';

const authService = baseAxios(`https://seeds-dev.seeds.finance/earn-exp/v1`);

export const getEarn = async (): Promise<any> => {
  try {
    let response = await authService.get('/tiers');
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};
