/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use-client';
import PlayQuiz from '@/components/microsite-quiz/containers/PlayQuiz';
import UseLifeline from '@/components/microsite-quiz/containers/UseLifeline';
import withAuth from '@/helpers/withAuth';
import {
  type IDetailQuiz,
  type LifelinesEnum,
  type QuestionI,
  type UseLifelineState
} from '@/utils/interfaces/quiz.interfaces';
import { useState } from 'react';

const QuizPlayScreen = () => {
  const [usingLifeline, setUsingLifeline] = useState<{
    show: boolean;
    lifeline?: LifelinesEnum;
  }>({ show: false });
  const [useLifelineState, setuseLifelineState] = useState<UseLifelineState>();
  const [quizQuestions, setquizQuestions] = useState<QuestionI[]>([]);
  const [expiryInSecond, setexpiryInSecond] = useState<number>();
  const [detailQuiz, setdetailQuiz] = useState<IDetailQuiz>();
  const [currentPage, setcurrentPage] = useState<number>(0);

  return (
    <>
      {usingLifeline.show ? (
        <UseLifeline
          useLifelineState={useLifelineState}
          quizQuestions={quizQuestions}
          expiryInSecond={expiryInSecond}
          detailQuiz={detailQuiz}
          currentPage={currentPage}
          finishUseLifeline={() => {
            setUsingLifeline({ show: false });
          }}
        />
      ) : (
        <PlayQuiz
          onUseLifeline={(
            useLifelineState,
            quizQuestions,
            expiryInSecond,
            detailQuiz,
            currentPage
          ) => {
            setuseLifelineState(useLifelineState);
            setquizQuestions(quizQuestions);
            setexpiryInSecond(expiryInSecond);
            setdetailQuiz(detailQuiz);
            setcurrentPage(currentPage);
            setUsingLifeline({ show: true });
          }}
          fromLifeline={{ page: currentPage, lifeline: useLifelineState }}
        />
      )}
    </>
  );
};

export default withAuth(QuizPlayScreen);
