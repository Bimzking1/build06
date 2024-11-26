/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { endQuiz, submitAnswer } from '@/repository/quiz.repository';
import {
  type QuestionDataI,
  type SubmitAnswerI
} from '@/utils/interfaces/quiz.interfaces';
import { type AxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const useQuiz = () => {
  const { t } = useTranslation();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [score, setScore] = useState(0);

  const submitQuizAnswer = async (
    payload: SubmitAnswerI
  ): Promise<QuestionDataI | undefined> => {
    try {
      setSubmitLoading(true);
      const answer = await submitAnswer(payload);
      if (answer.data.is_correct) {
        toast(t('quiz.correctWord', { point: Number(answer.score) - score }), {
          position: 'top-center'
        });
      } else {
        toast(t('quiz.incorrectWord'), {
          type: 'error',
          position: 'top-center'
        });
      }
      setScore(answer.score);
      return { ...answer.data.data, is_correct: answer.data.is_correct };
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

  const quitQuiz = async (id: string, callBack: () => void): Promise<void> => {
    try {
      setSubmitLoading(true);
      await endQuiz(id);
      callBack();
    } catch (error) {
      const err = error as AxiosError;
      if (err.message === '') {
        toast('Unknown error', { type: 'error' });
      } else {
        toast(err.message, { type: 'error' });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return { submitLoading, submitQuizAnswer, score, quitQuiz };
};

export default useQuiz;
