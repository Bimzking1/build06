import ThirdMedal from '@/assets/play/quiz/bronze-medal.png';
import FirstMedal from '@/assets/play/quiz/gold-medal.png';
import SecondMedal from '@/assets/play/quiz/silver-medal.png';
import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface Props {
  detailQuiz: IDetailQuiz | undefined;
  userInfo: UserInfo | undefined;
}

const WinQuizTable: React.FC<Props> = ({ detailQuiz, userInfo }: Props) => {
  const { t } = useTranslation();

  return (
    <table>
      {detailQuiz?.prizes?.map((item, i) => (
        <tr key={i} className="border">
          <td className="flex justify-center items-center p-3 w-full">
            <Image
              src={i === 0 ? FirstMedal : i === 1 ? SecondMedal : ThirdMedal}
              alt={`${i}-medal`}
              width={200}
              height={200}
              className=" w-5 h-5"
            />
            <div className="text-sm font-semibold text-[#262626]">
              {t(`quiz.${i === 0 ? 'first' : i === 1 ? 'second' : 'third'}`)}
            </div>
          </td>
          <td className="border text-sm font-normal text-[#262626] p-3 w-full">
            {item?.toLocaleString('id-ID', {
              currency: userInfo?.preferredCurrency ?? 'IDR',
              style: 'currency'
            })}
          </td>
        </tr>
      ))}
    </table>
  );
};

export default WinQuizTable;
