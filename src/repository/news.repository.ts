import baseAxios from '@/utils/common/axios';
import axios from 'axios';

const authService = baseAxios(`https://seeds-dev.seeds.finance/news/v1`);

export const getNews = async (): Promise<any> => {
  try {
    let response = await authService.get('/all');
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};

export const getExternalNews = async (): Promise<any> => {
  try {
    let response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'crypto',
        from: '2023-05-16',
        to: '2023-05-16',
        sortBy: 'popularity',
        apiKey: process.env.NEXT_PUBLIC_PUBLIC_NEWS_KEY,
        pageSize: 4
      }
    });
    return (response = { ...response?.data, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};
