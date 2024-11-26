import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import { useTranslation } from 'react-i18next';

interface Props {
  loading: boolean;
  handleButtonQuiz: () => void;
  invitationCode: string;
  detailQuiz: IDetailQuiz | undefined;
}

const QuizButton: React.FC<Props> = ({
  loading,
  handleButtonQuiz,
  invitationCode,
  detailQuiz
}: Props) => {
  const { t } = useTranslation();
  return (
    <button
      disabled={loading}
      onClick={handleButtonQuiz}
      className={`text-white lg:px-10 py-2 rounded-full font-semibold w-1/3 lg:w-full ${
        invitationCode === '' && detailQuiz?.is_need_invitation_code === true
          ? 'bg-[#7d7d7d]'
          : 'bg-seeds-button-green text-white'
      }`}
    >
      {loading
        ? t('quiz.loading')
        : detailQuiz?.participant_status === 'JOINED'
        ? t('quiz.start')
        : t('quiz.join')}
    </button>
  );
};

export default QuizButton;
