import OptionsList from '@/components/academy/OptionsList';
import QuestionCard from '@/components/academy/QuestionCard';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import {
  getPosttestQuestion,
  submitPosttestAnswer
} from '@/repository/academy.repository';
import i18n from '@/utils/common/i18n';
import {
  type QuestionI,
  type SubmitAnswerI
} from '@/utils/interfaces/academy.interface';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Posttest: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [questions, setQuestions] = useState<QuestionI[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [answerData, setAnswerData] = useState<SubmitAnswerI>({
    class_id: '',
    question_id: '',
    answer_id: ''
  });
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const { t } = useTranslation();

  const fetchPostTestQuestions = async (): Promise<void> => {
    try {
      const data = await getPosttestQuestion(id as string);
      setQuestions(data?.questions);
      setIsLoading(false);
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      void fetchPostTestQuestions();
    }
  }, [id]);

  const handleNextQuestion = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      if (selectedOptionId !== null) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex);
      }
    } else {
      void router.replace(
        `/academy/course/${id as string}/score?testType=posttest`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="my-4">
          <div className="animate-spinner w-14 h-14 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
        </div>
      </div>
    );
  }

  const currentQuestion = questions?.[currentQuestionIndex];
  const questionText =
    currentQuestion[`question_lang_${i18n.language}` as keyof QuestionI] ??
    currentQuestion.question_lang_id;

  const handleSelectOption = (selectedOptionId: string): void => {
    const selectedParticipant = currentQuestion?.participant_id.find(
      participant => participant.id === selectedOptionId
    );

    if (selectedParticipant != null) {
      setAnswerData({
        class_id: id as string,
        question_id: questions[currentQuestionIndex].id,
        answer_id: selectedParticipant.id
      });
    }
  };

  const handleSubmitAnswer = async (): Promise<void> => {
    try {
      if (
        answerData.question_id !== '' &&
        answerData.answer_id !== '' &&
        answerData.class_id !== ''
      ) {
        const response = await submitPosttestAnswer(answerData);
        setSelectedOptionId(null);
        if (response !== undefined) {
          toast('Answer submitted successfully!', { type: 'success' });
          setAnswerData({
            class_id: '',
            question_id: '',
            answer_id: ''
          });
        } else {
          toast('Answer already submitted!', { type: 'warning' });
          setAnswerData({
            class_id: '',
            question_id: '',
            answer_id: ''
          });
          setSelectedOptionId(null);
        }
      } else {
        toast('Please select an answer first!', { type: 'warning' });
      }
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  return (
    <PageGradient defaultGradient className="w-full">
      <div className="relative font-bold bg-white text-[#262626] md:p-4 p-3 rounded-xl mt-5 md:mt-0 w-full text-center">
        Post-Test
      </div>
      <div className="bg-white p-3 rounded-xl mt-5">
        <div
          style={{ backgroundImage: "url('/assets/academy/bg-pretest.png')" }}
          className="relative w-full bg-center bg-cover rounded-xl aspect-[1600/1900] sm:aspect-[1600/1700] md:aspect-[1600/1800] lg:aspect-[1600/1900] xl:aspect-[1600/900] overflow-auto shadow-md"
        >
          <div className="p-5">
            <QuestionCard
              question={questionText as string}
              questionNumber={`${currentQuestionIndex + 1}/${questions.length}`}
            />
            <OptionsList
              options={currentQuestion?.participant_id}
              selectedOptionId={selectedOptionId}
              onSelectOption={(selectedOptionId: string) => {
                setSelectedOptionId(selectedOptionId);
                handleSelectOption(selectedOptionId);
              }}
            />
          </div>
        </div>
        <div className="mt-10">
          <button
            className="p-3 rounded-3xl bg-[#3AC4A0] w-full text-white text-lg font-bold"
            onClick={() => {
              void handleSubmitAnswer();
              handleNextQuestion();
            }}
          >
            {currentQuestionIndex === questions?.length - 1
              ? t('academy.test.submit')
              : t('academy.test.next')}
          </button>
        </div>
      </div>
    </PageGradient>
  );
};

export default withAuth(Posttest);
