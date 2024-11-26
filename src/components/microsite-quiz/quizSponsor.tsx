import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import Image from 'next/image';

interface Props {
  detailQuiz: IDetailQuiz | undefined;
}

const QuizSponsor: React.FC<Props> = ({ detailQuiz }: Props) => {
  return (
    <div className="flex flex-row gap-2">
      {detailQuiz?.sponsors?.image_url !== undefined ? (
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg font-semibold text-[#262626]">Sponsor(s)</div>
          <Image
            src={detailQuiz?.sponsors?.image_url}
            alt=""
            width={200}
            height={200}
            className="object-contain max-h-16 max-w-16"
          />
        </div>
      ) : null}
      {detailQuiz?.communities?.image_url !== undefined ? (
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg font-semibold text-[#262626]">Community</div>
          <Image
            src={detailQuiz?.communities?.image_url}
            alt=""
            width={200}
            height={200}
            className="object-contain max-h-16 max-w-16"
          />
        </div>
      ) : null}
    </div>
  );
};

export default QuizSponsor;
