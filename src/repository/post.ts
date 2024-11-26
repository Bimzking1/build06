import BaseAxios from '@/utils/common/axios';
import { isEmptyString, isUndefindOrNull } from '@/utils/common/utils';

const service = BaseAxios('https://jsonplaceholder.typicode.com/', false);

export const getPosts = async (id: string | number): Promise<any> => {
  if (isUndefindOrNull(id) || isEmptyString(id)) {
    return await Promise.resolve(null);
  }

  const queryParams = {
    userId: 1
  };

  return await service.get(`/posts/${id}`, { params: queryParams });
};

export const createPost = async (formData: {
  title: string;
  subtitle: string;
  userId: number;
}): Promise<any> => {
  console.log(formData.title);
  if (
    isUndefindOrNull(formData.title) ||
    isUndefindOrNull(formData.subtitle) ||
    isUndefindOrNull(formData.userId)
  ) {
    return await Promise.resolve(null);
  }

  const body = JSON.stringify({
    title: formData.title,
    body: formData.subtitle,
    userId: formData.userId
  });

  return await service.post('/posts', body);
};
