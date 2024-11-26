import CloseButtonWithdrawal from '@/assets/play/quiz/CloseButtonWithdrawal.svg';
import { useAppSelector } from '@/store/redux/store';
import { Dialog, DialogBody, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { InfoBlue } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface IModalQuizWinner {
  open: boolean;
  handleOpen: () => void;
  score: number;
  prize: number;
  quizId: string;
  isShowWinnerAlert: boolean;
  winningPosition: number;
  winningLink: string;
  ordinalName: string;
  language: string;
  prizeType: string;
  preferredCurrency: string;
  winningImageSrc: string;
  quizName: string;
}

const ModalQuizWinner: React.FC<IModalQuizWinner> = ({
  open,
  handleOpen,
  score,
  prize,
  quizId,
  isShowWinnerAlert,
  winningPosition,
  winningLink,
  ordinalName,
  language,
  prizeType,
  preferredCurrency,
  winningImageSrc,
  quizName
}: IModalQuizWinner) => {
  const { dataUser } = useAppSelector(state => state.user);
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="md"
      className="h-[500px] md:h-screen overflow-y-auto md:p-5 flex flex-col items-center md:relative absolute bottom-0 m-0 rounded-b-none md:rounded-2xl min-w-full"
    >
      <DialogBody className="flex flex-col items-center md:gap-5 gap-4 p-0 h-full w-full">
        <div className="flex flex-row-reverse justify-between items-center w-full">
          <Image
            src={CloseButtonWithdrawal}
            alt="CloseButtonWithdrawal"
            className="cursor-pointer z-10"
            onClick={() => {
              handleOpen();
            }}
          />
        </div>

        <div className="overflow-auto flex flex-col items-center h-full w-full">
          <Typography className="block font-poppins font-semibold text-xl text-center text-wrap text-[#262626] mb-2">
            {t('quiz.winnerModalTitle')}
          </Typography>
          {isShowWinnerAlert && prizeType === 'LINK' && (
            <div className="flex flex-col justify-center items-center gap2">
              <div className="flex justify-center items-center gap-1">
                <Typography className="font-poppins font-semibold text-md text-center text-wrap text-[#262626]">
                  {t('quiz.winnerAlertMessage2')}
                </Typography>
                <Typography className="font-poppins font-semibold text-md text-center text-wrap text-[#262626]">
                  {t('quiz.winnerAlertMessage3')}
                </Typography>
                <Typography className="font-poppins font-semibold text-md text-center text-wrap text-[#262626]">
                  {language === 'EN'
                    ? `${winningPosition}${ordinalName}`
                    : `${winningPosition}`}
                </Typography>
                <Typography className="font-poppins font-semibold text-md text-center text-wrap text-[#262626]">
                  {t('quiz.winnerAlertMessage4')}
                </Typography>
              </div>
              <Typography className="font-poppins font-semibold text-md text-center text-wrap text-[#262626] italic">
                {`"${quizName}"`}
              </Typography>
            </div>
          )}
          <div
            className="w-full flex flex-col items-center justify-center px-4 py-2"
            style={{
              backgroundImage: "url('/assets/quiz/quizWinnerBg.png')",
              backgroundSize: 'contain'
            }}
          >
            <Image
              width={100}
              height={100}
              src="/assets/quiz/crown-duotone.png"
              alt="crown"
              className="w-[50px] h-[50px] md:w-[80px] md:h-[80px]"
            />
            <Image
              width={162}
              height={162}
              style={{
                objectFit: 'contain'
              }}
              src={dataUser?.avatar}
              className="rounded-full mb-4 w-[100px] h-[100px] md:w-[140px] md:h-[140px]"
              alt="profile"
            />
            <Typography className="font-poppins font-semibold text-md md:text-lg text-[#262626]">
              {dataUser?.name}
            </Typography>
            <Typography className="font-poppins text-md md:text-lg text-[#262626]">
              {t('quiz.score')} {score}
            </Typography>
          </div>
          {(prizeType === 'CASH' || prizeType === '') && (
            <Typography className="font-poppins font-semibold text-md md:text-lg text-[#262626] mb-4">
              {t('quiz.earn')} {preferredCurrency}{' '}
              {prize?.toLocaleString('id-ID')}
            </Typography>
          )}
          {(prizeType === 'CASH' || prizeType === '') && (
            <Typography className="font-poppins text-md md:text-lg text-[#262626] mb-4 text-center px-8">
              {t('quiz.tax')}
            </Typography>
          )}
          {isShowWinnerAlert && prizeType === 'LINK' && (
            <div className="flex gap-2 mb-4 px-4 md:px-0">
              <div className="flex justify-center items-center w-[24px] h-[24px]">
                <Image
                  width={200}
                  height={200}
                  src={InfoBlue}
                  alt="InfoBlue"
                  className="w-full h-full"
                />
              </div>
              <Typography className="font-poppins text-sm text-[#262626] text-center">
                {t('quiz.winnerAlertMessage7')}
              </Typography>
            </div>
          )}
          {isShowWinnerAlert &&
            prizeType === 'LINK' &&
            winningImageSrc !== undefined && (
              <div className="w-full px-4 flex justify-center items-center">
                <a
                  href={winningLink ?? ''}
                  target="_blank"
                  className="w-auto h-[100px] flex justify-center items-center rounded-lg overflow-hidden cursor-pointer hover:shadow-xl duration-300 animate-shadow-move"
                >
                  {winningImageSrc !== '' ? (
                    <Image
                      width={200}
                      height={200}
                      src={winningImageSrc}
                      alt="winningImageSrc"
                      className="w-auto h-full"
                    />
                  ) : (
                    <div className="w-[200px] h-full bg-seeds-button-green flex justify-center items-center text-white font-semibold font-poppins italic">
                      {t('quiz.winnerAlertMessage8')}
                    </div>
                  )}
                </a>
              </div>
            )}
          <div className="px-4 md:px-0 w-full md:w-2/3 gap-4 flex flex-row md:flex-col py-4 mb-32">
            {prizeType === 'CASH' || prizeType === '' ? (
              <button
                onClick={() => {
                  router.push(`/withdrawal?quizId=${quizId}`).catch(err => {
                    toast(`Error: ${err as string}`);
                  });
                }}
                className={`bg-[#A75CF4] relative flex items-center justify-center border-2 border-white w-full h-12 rounded-full shadow-sm shadow-gray-600 drop-shadow-sm hover:opacity-90`}
              >
                <div
                  className={`h-12 w-full bg-[#C286FF] rounded-full absolute inset-0`}
                />
                <div className="z-10 text-center  text-md md:text-xl font-semibold text-white">
                  {t('quiz.withdraw')}
                </div>
              </button>
            ) : (
              <a
                href={winningLink ?? ''}
                target="_blank"
                className={`bg-[#A75CF4] relative flex items-center justify-center border-2 border-white w-full h-12 rounded-full shadow-sm shadow-gray-600 drop-shadow-sm hover:opacity-90`}
              >
                <div className="z-10 text-center text-md md:text-xl font-semibold text-white">
                  {t('quiz.claimPrize')}
                </div>
              </a>
            )}
            <button
              onClick={() => {
                router.push(`/play/quiz/${quizId}/leaderboard`).catch(err => {
                  toast(`Error: ${err as string}`);
                });
              }}
              className={`bg-[#4EC307] relative flex items-center justify-center border-2 border-white w-full h-12 rounded-full shadow-sm shadow-gray-600 drop-shadow-sm hover:opacity-90`}
            >
              <div
                className={`h-12 w-full bg-[#67EB00] rounded-full absolute inset-0`}
              />
              <div className="z-10 text-center text-md md:text-xl font-semibold text-white">
                {t('quiz.leaderboard')}
              </div>
            </button>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ModalQuizWinner;
