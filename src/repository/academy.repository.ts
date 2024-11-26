import baseAxios from '@/utils/common/axios';
import {
  type EnrollClassI,
  type ListParamsI,
  type SubmitAnswerI
} from '@/utils/interfaces/academy.interface';
import { toast } from 'react-toastify';

const academyService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/academy/v1`
);

export const getAllCategory = async (params: ListParamsI): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.get(`/category`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getCategoryDetail = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.get(`/category/${id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getClassListByCategoryId = async (
  id: string,
  params: ListParamsI
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.get(`/category/${id}/class`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getAllClass = async (params: ListParamsI): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.get(`/class`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const startPretest = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.post(
      `/class/${id}/pre-test`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const startPosttest = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.post(
      `/class/${id}/post-test`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getPretestQuestion = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.get(
      `/class/${id}/pre-test/questions`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getPosttestQuestion = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.get(
      `/class/${id}/post-test/questions`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const submitPretestAnswer = async (
  formData: SubmitAnswerI
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.post(
      '/pre-test/submit-answer',
      formData,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const submitPosttestAnswer = async (
  formData: SubmitAnswerI
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.post(
      '/post-test/submit-answer',
      formData,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getPretestScore = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.get(`/class/${id}/pre-test/score`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getPosttestScore = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.get(`/class/${id}/post-test/score`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};

export const getClassDetail = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.get(`/class/${id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    // toast(error.message, { type: 'error' });
  }
};

export const enrollClass = async (
  id: string,
  formData: EnrollClassI
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await academyService.post(
      `/class/${id}/enroll`,
      formData,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error: any) {
    toast(error.message, { type: 'error' });
  }
};
