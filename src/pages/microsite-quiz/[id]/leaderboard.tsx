import { getLeaderBoardByQuizId } from '@/repository/quiz.repository';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import MyPosition from '@/components/microsite-quiz/leaderboard-mocrisite-quiz/myPosition';
import Podium, {
  type LeaderData
} from '@/components/microsite-quiz/leaderboard-mocrisite-quiz/podium';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import LanguageContext from '@/store/language/language-context';
import { getLocalStorage } from '@/utils/common/localStorage';
import { Button, Card, Progress, Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';

const LeaderBoardPage = (): React.ReactElement => {
  const router = useRouter();
  const { id } = router.query;
  const [leaderBoard, setLeaderBoard] = useState<LeaderData[]>([]);
  const [myRank, setMyRank] = useState();
  const { t } = useTranslation();
  const [fakeLoading, setFakeLoading] = useState(0);
  const languageCtx = useContext(LanguageContext);

  const getleaderboardData = async (): Promise<void> => {
    try {
      const res = await getLeaderBoardByQuizId(id);
      setMyRank(res.my_rank);
      setLeaderBoard(res.data);
    } catch (error) {
      toast.error('Error get leaderboard data');
    }
  };

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
    if (id !== undefined) {
      void getleaderboardData();
    }
  }, [id]);

  useEffect(() => {
    setInterval(() => {
      setFakeLoading(prev => prev + 1);
    }, 600);
    void getLastTranslation();
  }, []);

  useEffect(() => {
    if (fakeLoading === 100) {
      void router.push('/microsite-quiz');
      localStorage.clear();
    }
  }, [fakeLoading]);

  return (
    <PageGradient
      defaultGradient
      className="flex flex-col lg:h-full lg:p-4 gap-4"
    >
      <Progress
        value={fakeLoading}
        className="w-full shadow-md"
        size="lg"
        barProps={{ className: 'bg-[#3AC4A0]' }}
      />
      <div className="w-full flex flex-col lg:flex-row justify-center items-center lg:gap-6">
        <Card className="flex flex-col justify-start gap-4 w-full lg:w-2/3 lg:h-full rounded-none lg:rounded-2xl p-5">
          <div
            style={{
              backgroundImage: "url('/assets/quiz/bg-leaderboard-quiz.png')"
            }}
            className="flex justify-center rounded-2xl bg-no-repeat bg-cover"
          >
            <Podium leaderboard={leaderBoard} />
          </div>
          {myRank !== undefined && myRank > 0 ? (
            <MyPosition leaderboard={leaderBoard} myRank={myRank} />
          ) : null}
          <div className="h-32 overflow-y-scroll">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-5 text-center text-sm font-semibold font-poppins text-[#7C7C7C]">
                    {t('micrositeQuiz.rank')}
                  </th>
                  <th className="px-4 py-5 text-start text-sm font-semibold font-poppins text-[#7C7C7C]">
                    {t('micrositeQuiz.player')}
                  </th>
                  <th className="px-4 py-5 text-center text-sm font-semibold font-poppins text-[#7C7C7C]">
                    {t('micrositeQuiz.point')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderBoard?.slice(3).map((leader, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-2 py-5 text-center">{leader?.rank}.</td>
                    <td className="px-4 py-5 text-start flex items-center gap-3">
                      <img
                        src={leader?.avatar}
                        alt={leader?.name.split('_')[0]}
                        className="w-10 h-10 rounded-full"
                      />
                      <h1 className="text-base font-normal font-poppins text-[#262626]">
                        {leader?.name.split('_')[0]}
                      </h1>
                    </td>
                    <td className="px-4 py-5 text-center text-base font-normal font-poppins">
                      {leader?.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="flex flex-col justify-between items-center w-full lg:w-1/3 lg:h-full p-4 gap-2 rounded-none lg:rounded-2xl">
          <Typography className="font-semibold font-poppins text-xl text-[#262626]">
            Scan this!
          </Typography>
          <QRCode value="https://seeds.finance" size={200} />
          <div className="flex flex-col gap-4 justify-center items-center w-fit lg:w-full bg-[#E3FFF8] px-3.5 py-2.5">
            <Typography className="font-semibold font-poppins text-base text-[#262626]">
              Download Seeds App
            </Typography>
            <div className="flex w-full justify-center gap-4 lg:justify-evenly">
              <div className="flex flex-col gap-4 items-center">
                <QRCode
                  value="https://apps.apple.com/id/app/seeds-investing-together/id6443659980"
                  size={114}
                />
                <Typography className="font-normal font-poppins text-base text-[#262626]">
                  App Store
                </Typography>
              </div>
              <div className="flex flex-col gap-4 items-center">
                <QRCode
                  value="https://play.google.com/store/apps/details?id=com.seeds.investment&hl=en&gl=US"
                  size={114}
                />
                <Typography className="font-normal font-poppins text-base text-[#262626]">
                  Play Store
                </Typography>
              </div>
            </div>
          </div>
          <Button
            onClick={async () => {
              await router.push('/microsite-quiz');
            }}
            className="bg-[#3AC4A0] w-full sm:w-2/3 rounded-full normal-case font-poppins font-semibold text-white text-sm"
          >
            {t('quiz.playAgain')}
          </Button>
        </Card>
      </div>
    </PageGradient>
  );
};

export default withAuth(LeaderBoardPage);
