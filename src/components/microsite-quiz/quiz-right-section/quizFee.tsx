import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { useTranslation } from 'react-i18next';

interface Props {
  detailQuiz: IDetailQuiz | undefined;
  userInfo: UserInfo | undefined;
}

const QuizFee: React.FC<Props> = ({ detailQuiz, userInfo }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="text-sm font-normal text-[#7C7C7C]">
        {t('quiz.entranceFee')}
      </div>
      <div className="font-semibold text-xl text-[#262626]">
        {detailQuiz?.admission_fee === 0
          ? t('quiz.free')
          : detailQuiz?.admission_fee?.toLocaleString('id-ID', {
              currency: userInfo?.preferredCurrency ?? 'IDR',
              style: 'currency'
            })}
      </div>
    </div>
  );
};

export default QuizFee;
