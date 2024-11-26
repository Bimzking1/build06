import baseAxios from '@/utils/common/axios';

const authService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/email/v1`
);

export const postForgotPasswordByEmail = async (
  email?: string
): Promise<any> => {
  try {
    let response = await authService.post('/forgot-password', { email });
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const verifyForgotPasswordByEmail = async (payload: {
  email: string;
  code: string;
  password: string;
}): Promise<any> => {
  try {
    let response = await authService.post('/verify-forgot-password', payload);
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};
