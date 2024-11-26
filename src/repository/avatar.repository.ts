import baseAxios from '@/utils/common/axios';

const expService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/auth/v1/`
);

export const getAvatars = async (gender: 'male' | 'female'): Promise<any> => {
  return await expService.get('avatars', {
    headers: {
      Accept: 'application/json'
    },
    params: {
      gender
    }
  });
};
