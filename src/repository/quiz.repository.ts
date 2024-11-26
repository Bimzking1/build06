/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { isGuest } from '@/helpers/guest';
import baseAxios from '@/utils/common/axios';
import {
  type DailyQuizRes,
  type JoinQuizI,
  type LifelineReqI,
  type QuizCashoutI,
  type QuizStatus,
  type SubmitAnswerI
} from '@/utils/interfaces/quiz.interfaces';
import { type AxiosError, type AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const quizService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/quiz/v1`
);

export const getQuizLeaderboard = async (params: any): Promise<any> => {
  return await quizService.get(`/leaderboard`, {
    params
  });
};

export const getQuizTrending = async (currency: string): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  // if (accessToken === null || accessToken === '') {
  //   return await Promise.resolve('Access token not found');
  // }
  try {
    return await quizService.get(`/top?currency=${currency}`, {
      headers: {
        Accept: 'application/json',
        Authorization: accessToken === null ? '' : `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    console.error('Error fetching trending play list:', error);
  }
};

export const getAllQuiz = async ({
  search = '',
  status = '',
  page = 1,
  limit = 10,
  currency = ''
}: {
  search?: string;
  status: QuizStatus | '';
  page?: number;
  limit?: number;
  currency?: string;
}): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!isGuest() && (accessToken === null || accessToken === '')) {
      return await Promise.resolve('Access token not found');
    }

    const path = `/all?search=${search}&status=${status}&page=${page}&limit=${limit}&currency=${currency}`;
    return await quizService.get(path, {
      headers: {
        Accept: 'application/json',
        Authorization: isGuest() ? '' : `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    console.error('Error fetching trending play list:', error);
  }
};

export const getQuizById = async ({
  id,
  currency
}: {
  id: string;
  currency: string;
}): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const path = `/${id}?currency=${currency}`;
    return await quizService.get(path, {
      headers: {
        Accept: 'application/json',
        Authorization:
          isGuest() || accessToken === null ? '' : `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    console.error('Error fetching trending play list:', error);
  }
};

export const getQuizCategoryById = async (id: string): Promise<any> => {
  try {
    return await quizService.get(`/category/${id}`);
  } catch (error) {
    toast.error('Error get quiz category');
  }
};

export const getQuizReview = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }
    const path = `/${id}/reviews`;
    return await quizService.get(path, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    console.error('Error fetching trending play list:', error);
  }
};

export const joinQuiz = async (data: JoinQuizI): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    toast('Access token not found');
  }
  const path = `/join`;
  return await quizService.post(path, data, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const startQuiz = async (id: string): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      toast('Access token not found');
      return false;
    }
    const path = `/${id}/start?`;
    await quizService.post(
      path,
      { platform: 'WEB' },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return true;
  } catch (error) {
    const err = error as AxiosError;
    toast(err.message ?? 'Unknown Error');
    return false;
  }
};

export const getQuizQuestions = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }
    const path = `/${id}/questions`;
    return await quizService.get(path, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    console.error('Error fetching trending play list:', error);
  }
};

export const submitAnswer = async (data: SubmitAnswerI): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    toast('Access token not found');
  }
  const path = `/submit-answer`;
  return await quizService.patch(path, data, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const endQuiz = async (
  id: string
): Promise<AxiosResponse<any, any> | undefined> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    toast('Access token not found');
  }
  const path = `/${id}/end`;
  return await quizService.patch(
    path,
    {},
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    }
  );
};

export const fetchUseLifeline = async (payload: LifelineReqI): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    toast('Access token not found');
  }
  const path = `/use-lifeline`;
  return await quizService.patch(path, payload, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getLeaderBoardGlobal = async ({
  page = 1,
  limit = 10
}: {
  page?: number;
  limit?: number;
}): Promise<any> => {
  try {
    const params = {
      page,
      limit
    };
    return await quizService.get(`/leaderboard`, {
      params,
      headers: {
        Accept: 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
  }
};

export const getLeaderBoardByQuizId = async (quizId: any): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return await quizService.get(`/leaderboard/${quizId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard by quiz id:', error);
  }
};

export const cashoutQuiz = async (payload: QuizCashoutI): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    toast('Access token not found');
  }
  return await quizService.post('/cashout', payload, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getQuizWithdraw = async (quizId: string): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    toast('Access token not found');
  }
  return await quizService.get(`/withdraw/${quizId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const validateInvitationCode = async (
  quizId: string,
  invitationCode: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    const response = await quizService.get('/invitation/validate', {
      params: {
        quiz_id: quizId,
        invitation_code: invitationCode
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });

    return response;
  } catch (error) {
    console.error('Error validating invitation code:', error);
    throw error;
  }
};

export const getStatusDailyQuiz = async (): Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    toast('Access token not found');
  }
  return await quizService.get(`/daily-quiz/is_played`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const getDailyQuiz = async (): Promise<DailyQuizRes> => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken === null || accessToken === '') {
    toast('Access token not found');
  }
  return await quizService.get(`/daily-quiz`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`
    }
  });
};

export const submitAnswerDailyQuiz = async (payload: {
  question_id: string;
  answer_id: number;
}): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    const response = await quizService.post(
      '/daily-quiz/submit-answer',
      payload,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );

    return response;
  } catch (error) {
    console.error('Error validating invitation code:', error);
    throw error;
  }
};