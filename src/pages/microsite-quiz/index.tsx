/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import ListQuizEmpty from '@/assets/play/quiz/list-quiz-empty.jpg';
import FormModal from '@/components/microsite-quiz/formModal';
import QuestionsDetail from '@/components/microsite-quiz/questionsDetail';
import QuizButton from '@/components/microsite-quiz/quiz-right-section/quizButton';
import QuizCoins from '@/components/microsite-quiz/quiz-right-section/quizCoins';
import QuizFee from '@/components/microsite-quiz/quiz-right-section/quizFee';
import QuizInvitation from '@/components/microsite-quiz/quiz-right-section/quizInvitation';
import QuizTitle from '@/components/microsite-quiz/quiz-right-section/quizTitle';
import QuizDetail from '@/components/microsite-quiz/quizDetail';
import QuizSponsor from '@/components/microsite-quiz/quizSponsor';
import WinQuizTable from '@/components/microsite-quiz/winQuizTable';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import TrackerEvent from '@/helpers/GTM';
import { getUserInfo } from '@/repository/profile.repository';
import {
  getQuizById,
  validateInvitationCode
} from '@/repository/quiz.repository';
import { getTransactionSummary } from '@/repository/seedscoin.repository';
import LanguageContext from '@/store/language/language-context';
import i18n from '@/utils/common/i18n';
import { getLocalStorage } from '@/utils/common/localStorage';
import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Card, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const MicrositeQuiz = (): React.ReactElement => {
  const router = useRouter();
  const count = useRef(0);
  const id = process.env.NEXT_PUBLIC_DOMAIN
    ? 'c404a480-9088-4b0d-bb4f-c88b32cc3a74'
    : 'c9b630dc-217d-4454-b602-3c78ecc3c212';
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [detailQuiz, setDetailQuiz] = useState<IDetailQuiz>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [invitationCode, setInvitationCode] = useState<string>('');
  const languageCtx = useContext(LanguageContext);
  const currentUnixTime = Date.now() / 1000;
  const expiredUnixTime = parseInt(
    window.localStorage.getItem('expiresAt') as string
  );
  const [useCoins, setUseCoins] = useState<boolean>(false);
  const [totalAvailableCoins, setTotalAvailableCoins] = useState<number>(0);

  const handleOpen = (): void => {
    setOpen(!open);
  };

  const handleGetSeedsCoin = async (): Promise<void> => {
    try {
      const dataCoins = await getTransactionSummary();
      setTotalAvailableCoins(dataCoins?.data?.total_available_coins || 0);
    } catch (error: any) {
      toast.error(
        `Error get data coins: ${error?.response?.data?.message as string}`
      );
    }
  };

  const handleButtonQuiz = (): void => {
    if (localStorage.getItem('accessToken') !== null) {
      if (detailQuiz?.participant_status === 'JOINED') {
        router.push(`/microsite-quiz/${id as string}/start`);
      } else {
        if (detailQuiz?.is_need_invitation_code) {
          handleInvitationCode();
        } else {
          router.push(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `/microsite-quiz/${id as string}/welcome?useCoins=${useCoins}`
          );
        }
      }
    } else if (localStorage.getItem('accessToken') === null) {
      handleOpen();
    }
  };

  const handleInvitationCode = async (): Promise<void> => {
    try {
      if (detailQuiz?.is_need_invitation_code && invitationCode !== '') {
        const validationResponse = await validateInvitationCode(
          detailQuiz?.id ?? '',
          invitationCode
        );

        if (!validationResponse.is_valid) {
          toast.error('Invalid invitation code');
        } else {
          router.push(
            `/microsite-quiz/${
              id as string
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            }/welcome?invitationCode=${invitationCode}&useCoins=${useCoins}`
          );
        }
      }
    } catch (error) {
      toast.error('Error joining tournament');
    }
  };

  const getDetail = useCallback(
    async (currency: string) => {
      try {
        setLoading(true);
        const resp: IDetailQuiz = await getQuizById({
          id: id as string,
          currency
        });
        setDetailQuiz(resp);
      } catch (error) {
        toast(`ERROR fetch quiz ${error as string}`);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  const getLastTranslation = useCallback(async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined') {
        const translation = getLocalStorage('translation', 'EN');
        languageCtx.languageHandler(translation as 'EN' | 'ID');
      }
    } catch {
      toast.error('Error in translation');
    }
  }, []);

  useEffect(() => {
    void getLastTranslation();
    if (
      window.localStorage.getItem('accessToken') === null ||
      expiredUnixTime < currentUnixTime
    ) {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('expiresAt');
      window.localStorage.removeItem('refreshToken');
    }
  }, []);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();
        setUserInfo(dataInfo);
      } catch (error) {
        toast.error(`Error fetching data: ${error as string}`);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id) {
      getDetail(userInfo?.preferredCurrency ?? '');
    }
    if (userInfo?.preferredCurrency !== undefined) {
      handleGetSeedsCoin();
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (
      detailQuiz !== undefined &&
      userInfo !== undefined &&
      count.current === 0
    ) {
      TrackerEvent({
        event: 'SW_micorsite_quiz_page_detail',
        quizData: detailQuiz,
        userData: userInfo
      });
      count.current = 1;
    }
  }, [detailQuiz]);

  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';
  const handleCopyClick = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const textToCopy = `${baseUrl}/microsite-quiz/${detailQuiz?.id}`;
    await navigator.clipboard.writeText(textToCopy).then(() => {
      toast('Quiz link copied!');
    });
  };

  return (
    <PageGradient
      defaultGradient
      className="relative w-full h-full flex flex-col gap-2"
    >
      <FormModal
        id={id}
        useCoins={useCoins}
        open={open}
        detailQuiz={detailQuiz}
        handleInvitationCode={handleInvitationCode}
        handleOpen={handleOpen}
      />
      <Image
        src={
          detailQuiz?.banner?.image_url
            ? detailQuiz.banner.image_url
            : ListQuizEmpty
        }
        alt={detailQuiz?.name ?? ''}
        width={1000}
        height={1000}
        className="object-fill w-full h-2/6 rounded-3xl"
      />
      <div className="flex gap-4 w-full font-poppins">
        <Card className="flex flex-col gap-4 w-full lg:w-2/3 lg:px-8 px-4 lg:pb-8 pb-20 bg-white">
          <Typography className="lg:hidden font-poppins font-semibold text-lg text-[#262626]">
            {detailQuiz?.name}
          </Typography>
          <div className="w-full flex justify-center">
            <QuestionsDetail
              totalQuestions={detailQuiz?.total_questions}
              totalPlayed={detailQuiz?.total_played}
              startedAt={detailQuiz?.started_at}
              endedAt={detailQuiz?.ended_at}
            />
          </div>
          <QuizDetail
            title="Quiz Period"
            extraElement={
              <div className="text-base font-normal text-[#7C7C7C]">
                {moment(detailQuiz?.started_at).format('D MMM YYYY, h a')}{' '}
                Jakarta -{' '}
                {moment(detailQuiz?.ended_at).format('D MMM YYYY, h a')} Jakarta
              </div>
            }
          />
          <QuizDetail
            title="Terms & Conditions"
            extraElement={
              <div
                className="text-base font-normal text-[#7C7C7C]"
                dangerouslySetInnerHTML={{
                  __html: detailQuiz?.tnc
                    ? detailQuiz?.tnc[
                        i18n.language === 'id' ? 'id' : 'en'
                      ].replace(/\n/g, '<br />')
                    : '-'
                }}
              />
            }
          />
          <div className="flex gap-2">
            <QuizDetail
              title="Quiz Prize"
              className="flex flex-col gap-2 w-full"
              extraElement={
                <WinQuizTable detailQuiz={detailQuiz} userInfo={userInfo} />
              }
            />
            <QuizSponsor detailQuiz={detailQuiz} />
          </div>
        </Card>
        <Card className="fixed lg:static bottom-0 left-0 flex flex-row justify-between lg:flex-col gap-2.5 w-full lg:w-1/3 h-fit bg-white p-4 lg:p-6">
          <QuizTitle
            detailQuiz={detailQuiz}
            handleCopyClick={handleCopyClick}
          />
          {detailQuiz?.is_need_invitation_code && (
            <QuizInvitation
              value={invitationCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInvitationCode(e.target.value);
              }}
              placeholder={t('quiz.invitationCode')}
            />
          )}
          <QuizFee detailQuiz={detailQuiz} userInfo={userInfo} />
          <QuizCoins
            totalAvailableCoins={totalAvailableCoins}
            useCoins={useCoins}
            setUseCoins={setUseCoins}
          />
          <QuizButton
            loading={loading}
            handleButtonQuiz={handleButtonQuiz}
            invitationCode={invitationCode}
            detailQuiz={detailQuiz}
          />
        </Card>
      </div>
    </PageGradient>
  );
};

export default MicrositeQuiz;
