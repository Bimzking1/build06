import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import { ShareIcon } from '@heroicons/react/24/outline';

interface Props {
  detailQuiz: IDetailQuiz | undefined;
  handleCopyClick: () => Promise<void>;
}

const QuizTitle: React.FC<Props> = ({ detailQuiz, handleCopyClick }: Props) => {
  return (
    <div className="hidden lg:flex flex-row justify-between items-center gap-2">
      <div className="text-2xl font-semibold text-[#262626]">
        {detailQuiz?.name}
      </div>
      <button onClick={handleCopyClick}>
        <ShareIcon width={24} height={24} color="black" />
      </button>
    </div>
  );
};

export default QuizTitle;
