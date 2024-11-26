'use client';
import Wallet from '@/assets/my-profile/earning/wallet.svg';
import message from '@/assets/profile/message.svg';
import ExpInfo from '@/components/ExpInfo';
import { Share, Verified } from '@/constants/assets/icons';
import { standartCurrency } from '@/helpers/currency';
import { getEarningBalance } from '@/repository/earning.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { updateBlockUser } from '@/repository/user.repository';
import {
  type Experience,
  type Result,
  type UserInfo
} from '@/utils/interfaces/earning.interfaces';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ID from 'public/assets/images/flags/ID.png';
import { ArrowTaillessRight } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import FollowButton from '../FollowButton';
import MoreOptionHorizontal from '../MoreOptionHorizontal';
import Loading from '../popup/Loading';
import PostFollowSection from './PostFollowSection';

interface Params {
  profileData: any;
  expData: Experience;
  id?: string;
  handleSubmitBlockUser?: (event: React.FormEvent) => Promise<void>;
}

const Profile = ({
  profileData,
  expData,
  id,
  handleSubmitBlockUser
}: Params): JSX.Element => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [earning, setEarning] = useState<Result>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingEarn, setIsLoadingEarn] = useState<boolean>(false);
  const [isBlock, setIsBlock] = useState<boolean>(profileData?.status_blocked);
  const router = useRouter();
  const _handleReferalCode = async (): Promise<boolean> => {
    return await router.push({
      pathname: `/my-profile/referralCode`,
      query: { referralHistory: 'true' }
    });
  };

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== null && userInfo?.preferredCurrency !== undefined) {
      void fetchMyEarningsData(userInfo?.preferredCurrency);
    }
  }, [id, userInfo]);

  const onBlock = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await updateBlockUser(profileData?.id);
      setIsBlock(result.status);
    } catch (error) {
      toast.error(`Error follow user: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const _handleEditProfile = async (): Promise<boolean> => {
    return await router.push('/my-profile/edit-profile');
  };

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchMyEarningsData = async (currency: string): Promise<void> => {
    try {
      setIsLoadingEarn(true);
      const result = await getEarningBalance(currency);
      setEarning(result);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoadingEarn(false);
    }
  };

  return (
    <>
      {isLoading && isLoadingEarn && <Loading />}
      <div className="flex md:gap-5">
        <div className="shrink-0">
          <img
            src={profileData?.avatar}
            alt="AVATAR"
            className="rounded-full h-32 w-32 object-cover"
          />
        </div>
        <div className="flex flex-col w-full gap-4 justify-center">
          <div className="xl:flex hidden justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Typography className="text-lg font-semibold font-poppins text-[#201B1C]">
                  @{profileData?.seeds_tag ?? profileData?.seedsTag ?? ''}
                </Typography>
                {Boolean(profileData?.verified) && (
                  <Image
                    src={Verified?.src}
                    alt={Verified?.alt}
                    height={12}
                    width={12}
                  />
                )}
                {profileData?.label !== '' ? (
                  <div className="flex justify-center items-center py-1 px-2 bg-[#DCFCE4] my-0.5 rounded-full">
                    <p className="leading-4 text-[10px] text-[#1A857D] font-poppins font-normal">
                      {profileData?.label}
                    </p>
                  </div>
                ) : null}
                {profileData?.region !== '' ? (
                  <Image
                    src={ID}
                    alt="ID-flag"
                    className="w-[30px] h-[20px] self-center"
                  />
                ) : null}
              </div>
              <Typography className="text-sm text-[#7C7C7C] font-normal font-poppins">
                {profileData?.name}
              </Typography>
            </div>
            <div className="flex gap-4 items-center">
              {id == null ? (
                <>
                  <div
                    className="bg-[#DCFCE480] flex gap-2 items-center justify-center rounded-full px-4 py-2 border-[0.5px] border-dashed border-[#27A590] self-center cursor-pointer"
                    onClick={async () => await _handleReferalCode()}
                  >
                    <Typography className="text-[#27A590] text-sm font-normal font-poppins">
                      Ref.Code:{' '}
                      {profileData?.ref_code ?? profileData?.claims?.refCode}
                    </Typography>
                    <Image
                      src={Share.src}
                      alt={Share.alt}
                      width={14}
                      height={14}
                      className="bg-[#27A590] rounded-full p-[3px]"
                    />
                  </div>
                  <div
                    className="border border-[#262626] w-[94px] h-[42px] flex items-center justify-center rounded-full self-center cursor-pointer"
                    onClick={_handleEditProfile}
                  >
                    <Typography className="text-xs text-[#262626] font-poppins font-normal">
                      Edit Profile
                    </Typography>
                  </div>
                </>
              ) : (
                <>
                  {(
                    isBlock !== undefined
                      ? isBlock
                      : profileData?.status_blocked === true
                  ) ? (
                    <Button
                      disabled={isLoading}
                      onClick={onBlock}
                      className="bg-[#FF3838] flex gap-2 items-center justify-center rounded-full w-[147px] h-[42px] self-center text-[#FFFFFF] text-base font-semibold font-poppins normal-case"
                    >
                      Unblock
                    </Button>
                  ) : (
                    <FollowButton
                      userId={profileData?.id}
                      isFollowed={profileData?.status_followed}
                      customClass="bg-[#3AC4A0] flex gap-2 items-center justify-center rounded-full w-[147px] h-[42px] self-center text-[#FFFFFF] text-base font-semibold font-poppins normal-case"
                    />
                  )}
                  <div className="w-9 h-9 rounded-full bg-[#F2FDF9] flex justify-center">
                    <Image src={message} alt="Message" width={20} height={20} />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#F2FDF9] flex justify-center items-center">
                    <MoreOptionHorizontal
                      profileData={profileData}
                      handleSubmitBlockUser={handleSubmitBlockUser}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <PostFollowSection profileData={profileData} id={id} />
          <div className="xl:flex hidden">
            <Typography className="text-[#201B1C] text-base font-normal font-poppins">
              {profileData?.bio}
            </Typography>
          </div>
          <div className="xl:flex hidden">
            <ExpInfo data={expData} profileData={profileData} id={id} />
          </div>

          {/* My Earnings Breakpoint: XL */}
          <div
            onClick={async () => await router.push('/my-profile/my-earnings')}
            className="hidden w-full mt-2 bg-gradient-to-r from-[#53B5A3] to-[#5BE3C0] xl:flex justify-between items-center px-4 py-2 rounded-xl cursor-pointer font-poppins shadow hover:shadow-lg duration-300"
          >
            <div className="flex justify-start items-center">
              <div className="w-[40px] h-[40px] rounded-full p-2 bg-white">
                <Image
                  src={Wallet}
                  alt={'Wallet'}
                  height={100}
                  width={100}
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-col justify-start items-start ml-4 text-white">
                <div className="text-sm">{t('earning.myEarnings')}</div>
                <div className="font-semibold text-md">
                  {userInfo?.preferredCurrency !== undefined
                    ? userInfo?.preferredCurrency
                    : 'IDR'}
                  {standartCurrency(earning?.balance ?? 0).replace('Rp', '')}
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center h-[20px]">
              <Image
                src={ArrowTaillessRight}
                alt={'Arrow'}
                height={100}
                width={100}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
      {/* TODO: WEB IN MOBILE DEVICE */}
      <div className="flex xl:hidden flex-col gap-[7px] px-4 py-[15.5px]">
        <div className="flex gap-2">
          <Typography className="self-center text-sm font-semibold font-poppins text-[#222222]">
            @{profileData?.seeds_tag ?? profileData?.seedsTag ?? ''}
          </Typography>
          {Boolean(profileData?.verified) && (
            <Image
              src={Verified?.src}
              alt={Verified?.alt}
              height={12}
              width={12}
            />
          )}
          {profileData?.label !== '' ? (
            <div className="flex justify-center items-center py-1 px-2 bg-[#DCFCE4] my-0.5 rounded-full">
              <p className="leading-4 text-[10px] text-[#1A857D] font-poppins font-normal">
                {profileData?.label}
              </p>
            </div>
          ) : null}
          {profileData?.region !== '' ? (
            <Image
              src={ID}
              alt="ID-flag"
              className="w-[30px] h-[20px] self-center"
            />
          ) : null}
        </div>
        <Typography className="text-xs text-[#222222] font-normal font-poppins">
          {profileData?.name}
        </Typography>
        <Typography className="leading-4 text-[#222222] text-[10px] font-normal font-poppins">
          {profileData?.bio}
        </Typography>
      </div>
      <div className="flex xl:hidden gap-2.5 py-2 px-4 items-center">
        {id == null ? (
          <>
            <div
              className="bg-[#DCFCE480] flex gap-[37.5px] items-center justify-center rounded-full border-[0.5px] border-dashed border-[#27A590] self-center cursor-pointer px-4 py-2"
              onClick={async () => await _handleReferalCode()}
            >
              <Typography className="text-[#27A590] text-xs font-normal font-poppins">
                Ref.Code:{' '}
                {profileData?.ref_code ?? profileData?.claims?.refCode}
              </Typography>
              <Image
                src={Share.src}
                alt={Share.alt}
                width={14}
                height={14}
                className="bg-[#27A590] rounded-full p-[3px]"
              />
            </div>
            <div
              className="border border-[#262626] w-[166.5px] h-8 flex items-center justify-center rounded-full self-center cursor-pointer"
              onClick={_handleEditProfile}
            >
              <Typography className="text-xs text-[#262626] font-poppins font-normal">
                Edit Profile
              </Typography>
            </div>
          </>
        ) : (
          <>
            {(
              isBlock !== undefined
                ? isBlock
                : profileData?.status_blocked === true
            ) ? (
              <Button
                disabled={isLoading}
                onClick={onBlock}
                className="bg-[#FF3838] flex gap-2 items-center justify-center rounded-full w-[147px] h-[42px] self-center text-[#FFFFFF] text-base font-semibold font-poppins normal-case"
              >
                Unblock
              </Button>
            ) : (
              <FollowButton
                userId={profileData?.id}
                isFollowed={profileData?.status_followed}
                customClass="flex gap-2 items-center justify-center rounded-full w-[147px] h-8 self-center text-[#FFFFFF] text-base font-semibold font-poppins normal-case"
              />
            )}
            <div className="w-9 h-9 rounded-full bg-[#F2FDF9] flex justify-center">
              <Image src={message} alt="Message" width={20} height={20} />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#F2FDF9] flex justify-center items-center">
              <MoreOptionHorizontal
                profileData={profileData}
                handleSubmitBlockUser={handleSubmitBlockUser}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex xl:hidden">
        <ExpInfo data={expData} profileData={profileData} id={id} />
      </div>

      {/* My Earnings Breakpoint: SM */}
      <div
        onClick={async () => await router.push('/my-profile/my-earnings')}
        className="xl:hidden w-full mt-4 bg-gradient-to-r from-[#53B5A3] to-[#5BE3C0] flex justify-between items-center px-4 py-2 rounded-xl cursor-pointer font-poppins shadow hover:shadow-lg duration-300"
      >
        <div className="flex justify-start items-center">
          <div className="w-[40px] h-[40px] rounded-full p-2 bg-white">
            <Image
              src={Wallet}
              alt={'Wallet'}
              height={100}
              width={100}
              className="w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-start items-start ml-4 text-white">
            <div className="text-sm">{t('earning.myEarnings')}</div>
            <div className="font-semibold text-md">
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}
              {standartCurrency(earning?.balance ?? 0).replace('Rp', '')}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-[20px]">
          <Image
            src={ArrowTaillessRight}
            alt={'Arrow'}
            height={100}
            width={100}
            className="w-full h-full"
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
