import baseAxios from '@/utils/common/axios';

const service = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/web/v1/`
);

export const webCounter = async (): Promise<any> => {
  try {
    let response = await service.get('/counter');
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};
