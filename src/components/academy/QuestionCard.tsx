import React from 'react';
import { useTranslation } from 'react-i18next';

interface QuestionCardProps {
  question: string;
  questionNumber: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-row justify-between text-white font-medium text-lg">
        <div>{t('academy.test.question')}</div>
        <div>{questionNumber}</div>
      </div>
      <div className="text-white text-lg my-10">{question}</div>
    </div>
  );
};

export default QuestionCard;
