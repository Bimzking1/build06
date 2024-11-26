'use client';
import ReferralCircle from '@/assets/referralIcon/ReferralCircle.svg';
import copyGreen from '@/assets/referralIcon/copyGreen.svg';
import smReferralCircle from '@/assets/referralIcon/smReferralCircle.svg';
import CCard from '@/components/CCard';
import ExpInfo from '@/components/ExpInfo';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { Copy, ReferalOption1, ReferalOption3 } from '@/constants/assets/icons';
import { EarnXP } from '@/constants/assets/images';
import withAuth from '@/helpers/withAuth';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { getExpData } from '@/repository/exp.repository';
import {
  getReferralHistory,
  getUserInfo
} from '@/repository/profile.repository';
import {
  Button,
  Card,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface userInfoI {
  refCode: string;
  refCodeUsage: number;
}

const ReferalCode = (): JSX.Element => {
  const width = useWindowInnerWidth();
  const router = useRouter();
  const { referralHistory } = router.query;
  const [expData, setExpData] = useState<any>();
  const [refHistory, setRefHistory] = useState<any>();
  const [userInfo, setUserInfo] = useState<userInfoI | undefined>();
  const { t } = useTranslation();

  const customGradient = (
    <>
      <span className="z-0 fixed bottom-10 -left-10 w-60 h-48 bg-seeds-green-2 blur-[90px] rotate-45" />
      <span className="z-0 fixed bottom-0 left-0 w-24 h-24 bg-seeds-green-2 blur-[90px]" />
      <span className="z-0 fixed -bottom-28 left-16 w-48 h-32 bg-seeds-purple-2 blur-[90px] rotate-45" />
      <span className="z-0 fixed top-64 -right-4 w-60 h-48 bg-seeds-green-2 blur-[90px] rotate-45 rounded-full" />
      <span className="z-0 fixed bottom-36 right-0 w-32 h-32 bg-seeds-purple-2 blur-[90px] rotate-90 rounded-full" />
    </>
  );

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [userInfoResponse, expDataResponse] = await Promise.all([
          getUserInfo(),
          getExpData()
        ]);

        setUserInfo(userInfoResponse);
        setExpData(expDataResponse);

        if (userInfoResponse?.refCode !== undefined) {
          const refHistoryResponse = await getReferralHistory(
            userInfoResponse.refCode
          );
          setRefHistory(refHistoryResponse);
        }
      } catch (error: any) {
        toast(error.message, { type: 'error' });
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  return (
    <PageGradient
      customGradient={customGradient}
      className="flex flex-col md:gap-8 gap-5"
    >
      <Card
        shadow={false}
        className="rounded-none md:rounded-[18px] h-[196px] lg:h-[320px] bg-[#3AC4A0] flex flex-row justify-end items-center 2xl:justify-between"
      >
        <div className="hidden flex-col gap-4 ml-[33px] 2xl:flex">
          <Typography className="text-white text-3xl font-light font-poppins">
            Referral Code
          </Typography>
          <CCard className="flex w-[471.41px] h-[111px] p-[21.93px] gap-[15.07px]">
            <div className="flex items-center justify-between">
              <Popover placement="top">
                <PopoverHandler>
                  <Button className="w-[345.33px] h-[67.15px] px-[22px] bg-[#3AC4A0] flex flex-row justify-between items-center cursor-pointer">
                    <Typography className="text-white text-[19.19px] leading-[27.41px] font-poppins font-normal">
                      {userInfo?.refCode}
                    </Typography>
                    <div
                      className="flex gap-1"
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          userInfo?.refCode as string
                        );
                      }}
                    >
                      <Image
                        src={Copy.src}
                        alt={Copy.alt}
                        width={27.41}
                        height={27.41}
                      />
                      <Typography className="text-[19.19px] leading-[27.41px] font-semibold font-poppins text-white">
                        Copy
                      </Typography>
                    </div>
                  </Button>
                </PopoverHandler>
                <PopoverContent>
                  <span className="font-poppins">
                    Referral code has been copied!
                  </span>
                </PopoverContent>
              </Popover>
            </div>
          </CCard>
          <Typography className="text-2xl text-white font-normal font-poppins">
            {t('ReferralCode.total')}{' '}
            <span className="text-3xl text-white font-semibold font-poppins">
              {userInfo?.refCodeUsage}
            </span>
          </Typography>
        </div>
        <div className="self-end">
          <img
            src={EarnXP.src}
            alt={EarnXP.alt}
            className="absolute 2xl:right-0 right-1/2 transform translate-x-1/2 2xl:translate-x-0 bottom-0 z-10 h-[170px] lg:h-[294px]"
          />
          <Image
            src={ReferralCircle}
            alt="ReferralCircle"
            width={width !== undefined ? (width >= 1280 ? 228 : 300) : 300}
            className="lg:flex hidden lg:rounded-br-[18px]"
          />
          <Image
            src={smReferralCircle}
            alt="ReferralCircle"
            width={170}
            className="flex lg:hidden md:rounded-br-[18px]"
          />
        </div>
      </Card>
      <Card
        shadow={false}
        className="rounded-none md:rounded-[18px] p-4 md:p-6 bg-white flex gap-5 md:gap-4 -mt-5 md:mt-0"
      >
        <Typography className="text-[#262626] md:text-lg text-base font-poppins font-semibold">
          {t('ReferralCode.referal')}
        </Typography>
        <div className="flex gap-5 md:gap-4 flex-col lg:flex-row">
          <Card
            shadow={false}
            className="flex flex-row p-2 gap-2 bg-[#E9E9E980] lg:w-1/2 w-full"
          >
            <Image
              src={ReferalOption1.src}
              alt={ReferalOption1.alt}
              width={40}
              height={40}
            />
            <div className="flex flex-col justify-center">
              <Typography className="text-[#262626] text-sm font-poppins font-semibold">
                {t('ReferralCode.option1')}
              </Typography>
              <Typography className="text-[#262626] text-sm font-poppins font-normal">
                {t('ReferralCode.option1desc')}
              </Typography>
            </div>
          </Card>
          <Card
            shadow={false}
            className="flex flex-row p-2 gap-2 bg-[#E9E9E980] lg:w-1/2 w-full"
          >
            <Image
              src={ReferalOption3.src}
              alt={ReferalOption3.alt}
              width={40}
              height={40}
            />
            <div className="flex flex-col justify-center">
              <Typography className="text-[#262626] text-sm font-poppins font-semibold">
                {t('ReferralCode.option3')}
              </Typography>
              <Typography className="text-[#262626] text-sm font-poppins font-normal">
                {t('ReferralCode.option3desc')}
              </Typography>
            </div>
          </Card>
        </div>
      </Card>
      <Card
        shadow={false}
        className="rounded-none md:rounded-[18px] px-6 py-[17px]"
      >
        <ExpInfo data={expData} referralHistory={referralHistory} />
      </Card>
      {/* TODO: FOR MOBILE SIZE */}
      <Card
        className="flex 2xl:hidden w-full h-[174px] p-4 gap-2.5 rounded-none md:rounded-[18px]"
        shadow={false}
      >
        <Typography className="text-[#7C7C7C] text-xs font-normal font-poppins">
          Referral Code
        </Typography>
        <div className="flex items-center gap-3">
          <Popover placement="top">
            <PopoverHandler>
              <Button
                className="w-full h-11 p-3 bg-white border border-[#BDBDBD] flex flex-row justify-between items-center cursor-pointer"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    userInfo?.refCode as string
                  );
                }}
              >
                <Typography className="text-[#262626] text-sm font-poppins font-normal">
                  {userInfo?.refCode}
                </Typography>
                <div className="flex items-center gap-1">
                  <Image
                    src={copyGreen}
                    alt="copyGreen"
                    width={20}
                    height={20}
                  />
                  <Typography className="text-sm font-semibold font-poppins text-[#27A590]">
                    Copy
                  </Typography>
                </div>
              </Button>
            </PopoverHandler>
            <PopoverContent>
              <span className="font-poppins">
                Referral code has been copied!
              </span>
            </PopoverContent>
          </Popover>
        </div>
        <Typography className="text-xs text-[#7C7C7C] font-normal font-poppins">
          {t('ReferralCode.total')}
        </Typography>
        <Typography className="text-3xl text-[#262626] font-semibold font-poppins">
          {userInfo?.refCodeUsage}
        </Typography>
      </Card>
      {/* TODO: END OF MOBILE SIZE */}

      <Card
        shadow={false}
        className="p-4 bg-white flex gap-4 rounded-none md:rounded-[18px]"
      >
        <Typography className="text-[#262626] text-lg font-poppins font-semibold">
          {t('ReferralCode.referralHistory')}
        </Typography>
        <div className="flex flex-wrap gap-4">
          {refHistory?.data?.map((item: any, index: any) => {
            return (
              <Card
                shadow={false}
                className="flex flex-row items-center p-2.5 gap-3.5 bg-[#F9F9F9] xl:w-[403.67px] w-full"
                key={index}
              >
                <Image
                  src={ReferalOption1.src}
                  alt={ReferalOption1.alt}
                  width={40}
                  height={40}
                />
                <div className="flex flex-col justify-center">
                  <Typography className="text-[#262626] text-[10px] leading-4 font-poppins font-semibold">
                    {`${item.name as string} ${t('ReferralCode.used')}`}
                  </Typography>
                  <Typography className="text-[#7C7C7C] text-[10px] leading-4 font-poppins font-normal">
                    {`@${item.seeds_tag as string}`}
                  </Typography>
                  <Typography className="text-[#BDBDBD] text-[10px] leading-4 font-poppins font-normal">
                    {`${
                      item.created_at
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/') as string
                    }, ${
                      item.created_at.split('T')[1].split('.')[0] as string
                    } WIB`}
                  </Typography>
                </div>
                <Typography className="text-[#4DA81C] text-sm font-poppins font-semibold text-right w-[79px]">
                  {`+ 100 XP`}
                </Typography>
              </Card>
            );
          })}
        </div>
      </Card>
    </PageGradient>
  );
};

export default withAuth(ReferalCode);
