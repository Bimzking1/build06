import { isGuest } from '@/helpers/guest';
import baseAxios from '@/utils/common/axios';

const articleService = baseAxios(
  `${process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'}`
);

export const getArticle = async (params: {
  page: number;
  limit: number;
  search: string;
  language: string;
  source: string;
  category: string;
}): Promise<any> => {
  try {
    const response = await articleService.get('/news/v1/all', {
      params
    });

    return { ...response, status: 200 };
  } catch (error: any) {
    return error.response;
  }
};
export const getArticleHome = async (params: {
  page: number;
  limit: number;
  search: string;
  language: string;
  source: string;
  category: string;
  sort_by: string;
}): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response = await articleService.get('/news/v1/all', {
      params,
      headers: {
        Authorization: isGuest() ? '' : `Bearer ${accessToken ?? ''}`
      }
    });

    return { ...response, status: 200 };
  } catch (error: any) {
    return error.response;
  }
};
export const getArticleById = async (id: string): Promise<any> => {
  try {
    const response = await articleService.get(`/news/v1/${id}`);
    return { ...response, status: 200 };
  } catch (error: any) {
    return error.response;
  }
};

export const getArticleByIdHome = async (id: string): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response = await articleService.get(`/news/v1/${id}`, {
      headers: {
        Authorization: isGuest() ? '' : `Bearer ${accessToken ?? ''}`
      }
    });
    return { ...response, status: 200 };
  } catch (error: any) {
    return error.response;
  }
};
export const getArticleComment = async (id: string): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }

  try {
    let response = await articleService.get(`/news/v1/comment/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};
export const postComment = async (
  formRequest: any,
  articleId: number
): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }
  try {
    let response = await articleService.post(
      `/news/v1/comment/${articleId}`,
      formRequest,
      {
        headers: {
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};
export const postLike = async (formRequest: any, id: number): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    return await Promise.resolve('Access token not found');
  }
  try {
    let response = await articleService.post(
      `/news/v1/like/${id}`,
      formRequest,
      {
        headers: {
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return (response = { ...response, status: 200 });
  } catch (error: any) {
    return error.response;
  }
};
export const getHotNews = async (
  page: number,
  limit: number,
  language: string
): Promise<any> => {
  try {
    const response = await articleService.get('/news/v1/hot', {
      params: {
        page,
        limit,
        language
      }
    });
    return { ...response, status: 200 };
  } catch (error: any) {
    return error.response;
  }
};
