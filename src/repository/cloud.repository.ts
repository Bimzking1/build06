import baseAxios from '@/utils/common/axios';

const cloudService = baseAxios(
  `${process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'}/v1/`
);

export const postCloud = async (formData: {
  file: any;
  type: string;
}): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  class AccessTokenNotFoundError extends Error {
    constructor() {
      super('Access token not found');
      this.name = 'AccessTokenNotFoundError';
    }
  }

  if (accessToken === null || accessToken === '') {
    throw new AccessTokenNotFoundError();
  }

  try {
    const response = await cloudService.postForm('storage/cloud', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response;
  } catch (error: any) {
    return error.response;
  }
};
