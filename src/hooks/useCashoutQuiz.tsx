/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { cashoutQuiz } from '@/repository/quiz.repository';
import {
  type QuizCashoutI,
  type QuizCashoutRespI
} from '@/utils/interfaces/quiz.interfaces';
import { type AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const useQuizCashout = () => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const submitQuizCashout = async (
    payload: QuizCashoutI
  ): Promise<QuizCashoutRespI | undefined> => {
    try {
      setSubmitLoading(true);
      const data = await cashoutQuiz(payload);
      return data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.message === '') {
        toast('Unknown error', { type: 'error' });
      } else {
        toast(err.message, { type: 'error' });
      }
      return undefined;
    } finally {
      setSubmitLoading(false);
    }
  };

  return { submitLoading, submitQuizCashout };
};

export default useQuizCashout;
