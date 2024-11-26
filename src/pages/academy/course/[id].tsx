import PaymentPopup from '@/components/academy/PaymentPopup';
// import VoucherPromo from '@/components/academy/PromoCode';
import NoDataSeedy from '@/assets/academy/no-data-category.svg';
import ShortDescription from '@/components/academy/ShortDescription';
import VideoPlayer from '@/components/academy/VideoPlayer';
import ModalShareCourse from '@/components/popup/ModalShareCourse';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import {
  enrollClass,
  getClassDetail,
  startPretest
} from '@/repository/academy.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { getTransactionSummary } from '@/repository/seedscoin.repository';
import i18n from '@/utils/common/i18n';
import {
  type DetailClassI,
  type EnrollClassI,
  type LanguageDataI,
  type PriceDataI
} from '@/utils/interfaces/academy.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Switch } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiErrorWarningLine } from 'react-icons/ri';
import { toast } from 'react-toastify';

const DetailCourse: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isShareModal, setIsShareModal] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<DetailClassI | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const { t } = useTranslation();
  const [totalAvailableCoins, setTotalAvailableCoins] = useState<number>(0);
  const formattedPrice = data?.price?.[
    userInfo?.preferredCurrency?.toLowerCase() as keyof PriceDataI
  ]?.toLocaleString('id-ID', {
    currency: userInfo?.preferredCurrency ?? 'IDR',
    style: 'currency'
  });
  const [isUseCoins, setIsUseCoins] = useState<boolean>(false);

  const [enrollData, setEnrollData] = useState<EnrollClassI>({
    phone_number: ''
  });
  const togglePopup = async (): Promise<void> => {
    if (
      data?.is_owned === false &&
      (data?.price?.idr !== 0 || data?.price?.usd !== 0)
    ) {
      setShowPopup(!showPopup);
    } else {
      if (data?.is_owned === false) {
        const response = await enrollClass(id as string, enrollData);
        if (response?.payment_status === 'SUCCESS') {
          void router.push(`/academy/course/${id as string}/learn`);
        }
      } else {
        void router.push(`/academy/course/${id as string}/learn`);
      }
    }
  };

  const handleGetClass = async (): Promise<void> => {
    try {
      const responseClass = await getClassDetail(id as string);
      setData(responseClass);
      const responseUser = await getUserInfo();
      setUserInfo(responseUser);
      setEnrollData({
        phone_number: responseUser?.phoneNumber ?? ''
      });
      const dataCoins = await getTransactionSummary();
      setTotalAvailableCoins(dataCoins?.data?.total_available_coins ?? 0);
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      void handleGetClass();
    }
  }, [id]);

  const handleStartPretest = async (): Promise<void> => {
    try {
      if (data?.total_question !== undefined && data?.total_question > 0) {
        const response = await startPretest(id as string);
        if (response?.message === 'maximum pretest count already reached') {
          toast(response?.message, { type: 'warning' });
        } else {
          await router.push(`/academy/course/${id as string}/pretest`);
        }
      } else {
        toast('Questions not found!', { type: 'warning' });
      }
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  const handleUseCoins = (): void => {
    setIsUseCoins(!isUseCoins);
  };

  return (
    <>
      {isShareModal && (
        <ModalShareCourse
          onClose={() => {
            setIsShareModal(prev => !prev);
          }}
          url={id as string}
        />
      )}
      <PageGradient defaultGradient className="w-full">
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-5">
          <div className="relative">
            {data?.video !== '' ? (
              <>
                <div className="bg-white bg-opacity-40 w-full h-full z-30 absolute"></div>
                <VideoPlayer
                  videoSrc={data?.video as string}
                  title={data?.title as string}
                />
              </>
            ) : (
              <div className="flex justify-center items-center">
                <Image
                  src={NoDataSeedy}
                  alt="no video"
                  width={500}
                  height={500}
                  className="w-1/3 h-full"
                />
              </div>
            )}
          </div>
          <div className="font-bold text-2xl">{data?.title}</div>
          <div className="flex flex-row gap-5">
            <div className="flex flex-row items-center gap-2">
              <Image
                src={'/assets/academy/participants-icon.svg'}
                alt="icon-participants"
                width={100}
                height={100}
                className="w-7"
              />
              {data?.total_participants ?? 0}{' '}
              {t('academy.detailCourse.participants')}
            </div>
            <div
              onClick={() => {
                setIsShareModal(prev => !prev);
              }}
              className="flex flex-row items-center gap-2 cursor-pointer"
            >
              <Image
                src={'/assets/academy/share-icon.svg'}
                alt="icon-participants"
                width={100}
                height={100}
                className="w-7"
              />
              {t('academy.detailCourse.share')}
            </div>
          </div>
          <div className="text-lg">
            <ShortDescription
              text={
                data?.description?.[
                  i18n?.language as keyof LanguageDataI
                ] as string
              }
            />
          </div>
          <button
            className={`p-3 ${
              data?.total_question === 0 ? 'bg-[#CCCCCC]' : 'bg-[#7555DA]'
            }  rounded-3xl w-full text-white font-bold`}
            onClick={handleStartPretest}
          >
            {t('academy.detailCourse.buttonPretest')}
          </button>
        </div>
        <div className="bg-white p-4 rounded-xl mt-4 shadow-md flex flex-col gap-5">
          {data?.is_owned === false && data?.price?.idr !== 0 && (
            <>
              {/* develop when feature api is ready */}
              {/* <VoucherPromo detailClass={data} userInfo={userInfo} /> */}
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <Image
                    src={'/assets/images/goldHome.svg'}
                    alt="seeds-coin-icon"
                    width={100}
                    height={100}
                    className="w-10"
                  />
                  {t('academy.detailCourse.seedsCoin', {
                    data: totalAvailableCoins
                  })}
                </div>
                <Switch onClick={handleUseCoins} />
              </div>
            </>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-5">
            <div hidden={data?.is_owned === true}>
              <div className="text-xs text-[#7C7C7C]">
                {t('academy.detailCourse.entrance')}
              </div>
              <div className="font-bold">
                {data?.price?.idr !== 0
                  ? formattedPrice ?? (
                      <div className="text-[#3ac4a0] flex flex-row gap-1">
                        <RiErrorWarningLine />
                        <span className="text-xs">
                          {t('tournament.detailCurrency')}{' '}
                          {userInfo?.preferredCurrency !== undefined
                            ? userInfo?.preferredCurrency
                            : 'IDR'}
                        </span>
                      </div>
                    )
                  : t('academy.detailCourse.free')}
              </div>
            </div>
            <button
              className="p-3 bg-[#3AC4A0] rounded-3xl w-full text-white font-bold"
              onClick={togglePopup}
              hidden={formattedPrice === undefined}
            >
              {data?.is_owned === true
                ? t('academy.detailCourse.detail')
                : t('academy.detailCourse.buttonEnroll')}
            </button>
          </div>
        </div>
        <PaymentPopup
          isOpen={showPopup}
          onClose={togglePopup}
          classTitle={data?.title as string}
          amount={formattedPrice}
          isUseCoins={isUseCoins}
        />
      </PageGradient>
    </>
  );
};

export default withAuth(DetailCourse);
