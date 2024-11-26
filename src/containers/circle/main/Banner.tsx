import CCard from '@/components/CCard';
import {
  CircleDot,
  CircleLineBold,
  CircleLineBoldSmall,
  CircleLineLight,
  HistoryCirlceIcon,
  WithdrawCircleIcon
} from '@/constants/assets/icons';
import { getCircleBalance } from '@/repository/circle.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const BannerCircleList = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState<any>();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();

        setUserInfo(dataInfo);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balance, setBalance] = useState(0);
  const router = useRouter();

  const fetchCircleBalance = async (): Promise<void> => {
    try {
      setIsLoadingBalance(true);
      getCircleBalance()
        .then(res => {
          setBalance(res.data.balance);
          setIsLoadingBalance(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoadingBalance(false);
        });
    } catch (error: any) {
      setIsLoadingBalance(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  useEffect(() => {
    fetchCircleBalance()
      .then()
      .catch(() => {});
  }, []);

  return (
    <CCard className="p-5 md:mt-5 md:rounded-lg border-none rounded-none">
      <Card className="relative flex items-center justify-center bg-gradient-to-r from-[#B798FF] to-[#7555DA]">
        <Image
          src={CircleLineLight.src}
          alt={CircleLineLight.alt}
          height={0}
          width={0}
          className="absolute bottom-0 left-0 w-[6rem] h-[6rem]
                            md:w-[9rem] md:h-[9rem]"
        />

        <Image
          src={CircleLineBold.src}
          alt={CircleLineBold.alt}
          height={0}
          width={0}
          className="absolute bottom-0 right-0 w-[4.5rem] h-[4.5rem]
                            sm:w-[8rem] sm:h-[8rem]
                            md:w-[10.4rem] md:h-[10.4rem]"
        />

        <Image
          src={CircleLineBoldSmall.src}
          alt={CircleLineBoldSmall.alt}
          height={0}
          width={0}
          className="absolute bottom-0 right-0 w-[2rem] h-[2rem]
                            sm:w-[4rem] sm:h-[4rem]
                            md:w-[5.5rem] md:h-[5.5rem]"
        />

        {/* DOT KIRI */}
        <Image
          src={CircleDot.src}
          alt={CircleDot.alt}
          height={13}
          width={13}
          className="absolute top-[20%] left-[6%] hidden sm:inline-block"
        />

        <Image
          src={CircleDot.src}
          alt={CircleDot.alt}
          height={13}
          width={13}
          className="absolute top-[25%] left-[24%] hidden sm:inline-block"
        />

        <Image
          src={CircleDot.src}
          alt={CircleDot.alt}
          height={13}
          width={13}
          className="absolute bottom-[15%] left-[22%] hidden sm:inline-block"
        />

        {/* DOT Kanan */}
        <Image
          src={CircleDot.src}
          alt={CircleDot.alt}
          height={13}
          width={13}
          className="absolute top-[25%] right-[24%] hidden sm:inline-block"
        />

        <CardBody>
          <Typography
            color="white"
            className="text-base font-normal text-center"
          >
            Circle Balance
          </Typography>
          <Typography
            color="white"
            className="text-2xl font-semibold text-center my-2"
          >
            {isLoadingBalance
              ? 'Loading...'
              : `${
                  userInfo?.preferredCurrency as string
                } ${new Intl.NumberFormat().format(balance)}`}
          </Typography>
          <div className="flex flex-row gap-7">
            <div className="">
              <div
                className="bg-white rounded-lg p-4 w-fit h-[70%]"
                onClick={() => {
                  void router.push(`/connect/transaction-history`);
                }}
              >
                <Image
                  src={HistoryCirlceIcon.src}
                  alt={HistoryCirlceIcon.alt}
                  height={22}
                  width={22}
                />
              </div>
              <p className="text-sm font-normal text-white mt-2">History</p>
            </div>

            <div className="">
              <div
                className="bg-white rounded-lg p-4 w-fit h-[70%]"
                onClick={() => {
                  void router.push(`/connect/withdrawal`);
                }}
              >
                <Image
                  src={WithdrawCircleIcon.src}
                  alt={WithdrawCircleIcon.alt}
                  height={26}
                  width={26}
                />
              </div>
              <p className="text-sm font-normal text-white mt-2">Withdraw</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </CCard>
  );
};

export default BannerCircleList;
