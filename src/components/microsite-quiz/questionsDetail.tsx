import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  totalQuestions: number | undefined;
  totalPlayed: number | undefined;
  endedAt: Date | undefined;
  startedAt: Date | undefined;
}

const QuestionsDetail: React.FC<Props> = ({
  totalQuestions,
  totalPlayed,
  endedAt,
  startedAt
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className=" flex lg:w-2/3 border border-[#E9E9E9] rounded-2xl">
      <div className="flex flex-col w-fit justify-center items-center p-4 ">
        <div className="text-lg font-semibold text-[#262626]">
          {totalQuestions}
        </div>
        <div className="text-xs font-normal text-[#7C7C7C]">
          {t('quiz.questions')}
        </div>
      </div>
      <div className="flex flex-col w-full justify-center items-center p-4 border-r border-l border-[#E9E9E9]">
        <div className="text-lg font-semibold text-[#262626]">
          {totalPlayed}
        </div>
        <div className="text-xs font-normal text-[#7C7C7C]">
          {t('quiz.played')}
        </div>
      </div>
      <div className="flex flex-col whitespace-nowrap w-full justify-center items-center p-4">
        <div className="text-lg font-semibold text-[#262626]">
          {t('quiz.dayDuration', {
            duration: Math.floor(
              moment(endedAt).diff(moment(startedAt), 'days', true)
            )
          })}
        </div>
        <div className="text-xs font-normal text-[#7C7C7C]">
          {t('quiz.duration')}
        </div>
      </div>
    </div>
  );
};

export default QuestionsDetail;
