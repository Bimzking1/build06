import CrownIlust from '@/assets/product/CrownIlust.png';
import LeaderboardRank from '@/assets/product/LeaderboardRank.png';
import WinRateProduct from '@/assets/product/WinRateProduct.svg';
import { getPlayLeaderboard } from '@/repository/play.repository';
import { getQuizLeaderboard } from '@/repository/quiz.repository';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

interface Quiz {
  limit: number;
  page: number;
}

const quiz: Quiz = {
  limit: 3,
  page: 1
};

const NewSection2: React.FC = () => {
  const { t } = useTranslation();
  const [Lead, setLead] = useState<any[]>([]);
  const [isChange, setChange] = useState('arena');
  const [isBottom, setBottom] = useState(0);
  const measurement = 900;

  const { ref, inView, entry } = useInView({
    threshold: 0.2
  });
  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        if (isChange === 'arena') {
          const playLeadResponse = await getPlayLeaderboard();
          setLead(playLeadResponse.playLeaderboards);
        } else if (isChange === 'quiz') {
          const quizLeadResponse = await getQuizLeaderboard(quiz);
          setLead(quizLeadResponse.data);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, [isChange]);
  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center md:pt-[43px] md:pb-[54px] py-[40px] px-4 w-full"
    >
      {/* <Image
        src={BlurLeadTop}
        alt="BlurLeadTop"
        className="absolute top-0 left-0"
      />
      <Image
        src={BlurLeadBottom}
        alt="BlurLeadBottom"
        className="absolute bottom-0 right-0"
      /> */}
      <div
        className={`flex flex-col items-center ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        {/* <Image
          src={LeaderboardLine}
          alt="LeaderboardLine"
          className="xl:-mb-[65px] -mb-[40px] xl:w-[520px] w-[290px]"
        /> */}
        <Typography className="font-poppins font-semibold xl:text-5xl text-3xl bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF] inline-block bg-clip-text text-transparent">
          {`${t('landingPageV2.product.section2.title1')}`}
        </Typography>
      </div>
      <div
        className={`flex flex-col xl:mt-[41.5px] xl:mb-10 my-6 ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="flex justify-center gap-6">
          <Button
            onClick={() => {
              setChange('arena');
            }}
            className={`bg-transparent ${
              isChange === 'arena'
                ? 'bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF]'
                : 'bg-white'
            } p-3 rounded-2xl`}
          >
            <Typography
              className={`font-poppins font-semibold md:text-lg text-xs capitalize  ${
                isChange === 'arena' ? 'text-[#FFFFFF]' : 'text-[#7C7C7C]'
              }`}
            >
              Play Arena
            </Typography>
          </Button>
          <Button
            onClick={() => {
              setChange('quiz');
            }}
            className={`bg-transparent ${
              isChange === 'quiz'
                ? 'bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF]'
                : 'bg-white'
            } p-3 rounded-2xl`}
          >
            <Typography
              className={`font-poppins font-semibold md:text-lg text-xs capitalize  ${
                isChange === 'quiz' ? 'text-[#FFFFFF]' : 'text-[#7C7C7C]'
              }`}
            >
              Quiz
            </Typography>
          </Button>
        </div>
      </div>
      <div
        className={` flex flex-col items-center ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="flex mx-6 gap-[24px] md:gap-[101px] items-end -mb-[5.29px] md:-mb-[7.55px]">
          <div className="flex flex-col items-center gap-[5.2px] md:gap-[14.32px] -mb-[28.2px] md:-mb-[60.85px]">
            <Image
              src={Lead[1]?.avatar_url ?? Lead[1]?.avatar}
              alt="Avatar"
              width={200.23}
              height={200.23}
              className="rounded-full w-[83.56px] md:w-[200.23px]"
            />
            <Typography className="font-poppins font-semibold text-xs md:text-xl text-[#201B1C] capitalize">
              {(Lead[1]?.user_full_name?.length > 17
                ? `${Lead[1]?.user_full_name.substring(0, 17) as string}...`
                : Lead[1]?.user_full_name) ??
                (Lead[1]?.name?.length > 17
                  ? `${Lead[1]?.name.substring(0, 17) as string}...`
                  : Lead[1]?.name)}
            </Typography>
            <div className="flex justify-center items-center gap-[2.78px] md:gap-[6.4px] bg-[#DCFCE4] w-[61.42px] md:w-[141.51px] h-[15.27px] md:h-[35.18px] md:rounded-md rounded-sm">
              <Typography className="font-poppins font-semibold md:text-base text-[6.94px] leading-[9.72px] text-[#3AC4A0]">
                Win Rate
              </Typography>
              <div className="flex gap-[1.4px] md:gap-[3.2px]">
                <Image
                  src={WinRateProduct}
                  alt="WinRateProduct"
                  className="w-[4.86px] md:w-[11.19px]"
                />
                <Typography className="font-poppins font-semibold text-[4.18px] md:text-[9.59px] leading-[5.57px] md:leading-[12.79px] text-[#3AC4A0]">
                  ({Math.round(Lead[1]?.win_rate)}%)
                </Typography>
              </div>
            </div>
            <div className=" p-[1px] bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF] w-full rounded-lg">
              <div className="flex justify-between h-full w-full bg-white rounded-lg md:p-3 p-1">
                <div className="flex flex-col justify-between text-center">
                  <Typography className="font-poppins font-medium text-[5px] leading-[12px] md:text-sm text-[#BDBDBD]">
                    Play
                  </Typography>
                  <Typography className="font-poppins font-semibold text-xs md:text-lg text-[#201B1C]">
                    {Lead[1]?.total_play}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography className="font-poppins font-medium text-[5px] leading-[12px] md:text-sm text-[#BDBDBD]">
                    Win
                  </Typography>
                  <Typography className="font-poppins font-semibold text-xs md:text-lg text-[#201B1C]">
                    {Lead[1]?.total_win}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography className="font-poppins font-medium text-[5px] leading-[12px] md:text-sm text-[#BDBDBD]">
                    Lose
                  </Typography>
                  <Typography className="font-poppins font-semibold text-xs md:text-lg text-[#201B1C]">
                    {Lead[1]?.total_lose}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[5.2px] md:gap-[14.32px]">
            <Image
              src={CrownIlust}
              alt="CrownIlust"
              className="w-[32.49px] md:w-[91px]"
            />
            <Image
              src={Lead[0]?.avatar_url ?? Lead[0]?.avatar}
              alt="Avatar"
              width={200.23}
              height={200.23}
              className="rounded-full w-[83.56px] md:w-[200.23px]"
            />
            <Typography className="font-poppins font-semibold text-xs md:text-xl text-[#201B1C] capitalize">
              {(Lead[0]?.user_full_name?.length > 17
                ? `${Lead[0]?.user_full_name.substring(0, 17) as string}...`
                : Lead[0]?.user_full_name) ??
                (Lead[0]?.name?.length > 17
                  ? `${Lead[0]?.name.substring(0, 17) as string}...`
                  : Lead[0]?.name)}
            </Typography>
            <div className="flex justify-center items-center gap-[2.78px] md:gap-[6.4px] bg-[#DCFCE4] w-[61.42px] md:w-[141.51px] h-[15.27px] md:h-[35.18px] md:rounded-md rounded-sm">
              <Typography className="font-poppins font-semibold md:text-base text-[6.94px] leading-[9.72px] text-[#3AC4A0]">
                Win Rate
              </Typography>
              <div className="flex gap-[1.4px] md:gap-[3.2px]">
                <Image
                  src={WinRateProduct}
                  alt="WinRateProduct"
                  className="w-[4.86px] md:w-[11.19px]"
                />
                <Typography className="font-poppins font-semibold text-[4.18px] md:text-[9.59px] leading-[5.57px] md:leading-[12.79px] text-[#3AC4A0]">
                  ({Math.round(Lead[0]?.win_rate)}%)
                </Typography>
              </div>
            </div>
            <div className=" p-[1px] bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF] w-full rounded-lg">
              <div className="flex justify-between h-full w-full bg-white rounded-lg md:p-3 p-1">
                <div className="flex flex-col justify-between text-center">
                  <Typography className="font-poppins font-medium text-[5px] leading-[12px] md:text-sm text-[#BDBDBD]">
                    Play
                  </Typography>
                  <Typography className="font-poppins font-semibold text-xs md:text-lg text-[#201B1C]">
                    {Lead[0]?.total_play}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography className="font-poppins font-medium text-[5px] leading-[12px] md:text-sm text-[#BDBDBD]">
                    Win
                  </Typography>
                  <Typography className="font-poppins font-semibold text-xs md:text-lg text-[#201B1C]">
                    {Lead[0]?.total_win}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography className="font-poppins font-medium text-[5px] leading-[12px] md:text-sm text-[#BDBDBD]">
                    Lose
                  </Typography>
                  <Typography className="font-poppins font-semibold text-xs md:text-lg text-[#201B1C]">
                    {Lead[0]?.total_lose}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[5.2px] md:gap-[14.32px] -mb-[44.17px] md:-mb-[99.34px]">
            <Image
              src={Lead[2]?.avatar_url ?? Lead[2]?.avatar}
              alt="Avatar"
              width={200.23}
              height={200.23}
              className="rounded-full w-[83.56px] md:w-[200.23px]"
            />
            <Typography className="font-poppins font-semibold text-xs md:text-xl text-[#201B1C] capitalize">
              {(Lead[2]?.user_full_name?.length > 17
                ? `${Lead[2]?.user_full_name.substring(0, 17) as string}...`
                : Lead[2]?.user_full_name) ??
                (Lead[2]?.name?.length > 17
                  ? `${Lead[2]?.name.substring(0, 17) as string}...`
                  : Lead[2]?.name)}
            </Typography>
            <div className="flex justify-center items-center gap-[2.78px] md:gap-[6.4px] bg-[#DCFCE4] w-[61.42px] md:w-[141.51px] h-[15.27px] md:h-[35.18px] md:rounded-md rounded-sm">
              <Typography className="font-poppins font-semibold md:text-base text-[6.94px] leading-[9.72px] text-[#3AC4A0]">
                Win Rate
              </Typography>
              <div className="flex gap-[1.4px] md:gap-[3.2px]">
                <Image
                  src={WinRateProduct}
                  alt="WinRateProduct"
                  className="w-[4.86px] md:w-[11.19px]"
                />
                <Typography className="font-poppins font-semibold text-[4.18px] md:text-[9.59px] leading-[5.57px] md:leading-[12.79px] text-[#3AC4A0]">
                  ({Math.round(Lead[2]?.win_rate)}%)
                </Typography>
              </div>
            </div>
            <div className=" p-[1px] bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF] w-full rounded-lg">
              <div className="flex justify-between h-full w-full bg-white rounded-lg md:p-3 p-1">
                <div className="flex flex-col justify-between text-center">
                  <Typography className="font-poppins font-medium text-[5px] leading-[12px] md:text-sm text-[#BDBDBD]">
                    Play
                  </Typography>
                  <Typography className="font-poppins font-semibold text-xs md:text-lg text-[#201B1C]">
                    {Lead[2]?.total_play}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography className="font-poppins font-medium text-[5px] leading-[12px] md:text-sm text-[#BDBDBD]">
                    Win
                  </Typography>
                  <Typography className="font-poppins font-semibold text-xs md:text-lg text-[#201B1C]">
                    {Lead[2]?.total_win}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography className="font-poppins font-medium text-[5px] leading-[12px] md:text-sm text-[#BDBDBD]">
                    Lose
                  </Typography>
                  <Typography className="font-poppins font-semibold text-xs md:text-lg text-[#201B1C]">
                    {Lead[2]?.total_lose}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Image
          src={LeaderboardRank}
          alt="LeaderboardRank"
          className="w-[343px] md:w-[900px]"
        />
      </div>
    </section>
  );
};

export default NewSection2;
