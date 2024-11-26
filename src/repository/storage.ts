import axios from 'axios';

const url = `${
  process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
}/v1/storage`;

export const uploadCloud = async (formData: any): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  return await post(url + '/cloud', formData, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

const post = async (url: string, payload: any, headers = {}): Promise<any> => {
  return await axios({
    method: 'POST',
    url,
    data: payload,
    headers
  });
};
