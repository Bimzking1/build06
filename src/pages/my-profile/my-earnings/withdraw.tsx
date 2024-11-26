'use-client';

import CircleBackground from '@/assets/my-profile/earning/circleBackground.svg';
import Loading from '@/components/popup/Loading';
import ModalWithdrawList from '@/components/popup/ModalWithdrawList';
import { standartCurrency } from '@/helpers/currency';
import withAuth from '@/helpers/withAuth';
import { getEarningBalance } from '@/repository/earning.repository';
import { getWithdrawalMyEarning } from '@/repository/payment.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type RootState } from '@/store/earnings';
import {
  setAccountName,
  setAccountNumber
} from '@/store/earnings/withdrawSlice';
import { type Result } from '@/utils/interfaces/earning.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { type Type_VA } from '@/utils/interfaces/withdraw.interfaces';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowDownCollapse } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Withdraw = (): React.ReactElement => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [earning, setEarning] = useState<Result>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [paymentType, setPaymentType] = useState<string>('bank');
  const [isLoadingEarn, setIsLoadingEarn] = useState<boolean>(false);
  const [isShowWithdrawList, setIsShowWithdrawList] = useState<boolean>(false);
  const [listVA, setListVA] = useState<Type_VA[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const dispatch = useDispatch();
  const { accountName, bankAccount, accountNumber } = useSelector(
    (state: RootState) => state?.withdraw ?? {}
  );

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchMyEarningsData(userInfo?.preferredCurrency);
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchPaymentList(userInfo?.preferredCurrency ?? 'IDR');
    }
  }, [id, userInfo, paymentType, searchQuery]);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast(`Error fetching data: ${error as string}`);
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

  const handleInputAccountName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value.replace(/[^a-zA-Z\s]/g, '');
    dispatch(setAccountName(value));
  };

  const handleInputAccountNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value.replace(/\D/g, '');
    dispatch(setAccountNumber(value));
  };

  const handleOpenWithdrawList = (): void => {
    setIsShowWithdrawList(true);
  };

  const fetchPaymentList = async (currency: string): Promise<void> => {
    try {
      const result = await getWithdrawalMyEarning({
        search: searchQuery,
        currency
      });
      if (paymentType === 'bank') {
        setListVA(result?.type_va);
      } else if (paymentType === 'e-wallet') {
        setListVA(result?.type_ewallet);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  return (
    <>
      {isLoadingEarn && <Loading />}

      {isShowWithdrawList && userInfo != null && (
        <ModalWithdrawList
          onClose={() => {
            setIsShowWithdrawList(prev => !prev);
            setSearchQuery('');
          }}
          paymentType={paymentType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          listVA={listVA}
          userInfo={userInfo}
        />
      )}
      <div className="w-full flex flex-col justify-center items-center rounded-xl p-5 bg-white">
        <Typography className="w-full text-center text-lg md:text-xl font-semibold font-poppins mt-4">
          {t('earning.withdraw')}
        </Typography>

        {/* My Earnings */}
        <div className="relative w-full bg-gradient-to-r from-[#53B5A3] to-[#5BE3C0] p-4 mt-4 rounded-xl overflow-hidden">
          <div className="w-full flex justify-between items-center z-10">
            <Typography className="w-full flex font-poppins text-sm text-white z-10">
              {t('earning.myEarnings')}
            </Typography>
          </div>
          <div className="w-full flex justify-between items-center mt-2 z-10">
            <Typography className="font-semibold font-poppins text-white text-base md:text-lg lg:text-xl z-10">
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}
              {standartCurrency(earning?.balance ?? 0).replace('Rp', '')}
            </Typography>
          </div>
          <Image
            alt="CircleBackground"
            src={CircleBackground}
            width={100}
            height={100}
            className="absolute right-0 bottom-1 z-0 w-[90px] h-[90px]"
          />
        </div>

        {/* Payment Type */}
        <div className="w-full bg-[#E9E9E9] rounded-full flex justify-center items-center mt-4 p-2 gap-2">
          <Typography
            onClick={() => {
              setPaymentType('bank');
            }}
            className={`${
              paymentType === 'bank'
                ? 'bg-white text-black shadow-lg '
                : 'bg-[#E9E9E9] text-[#BDBDBD]'
            } w-full flex justify-center items-center py-2 rounded-full cursor-pointer font-poppins text-xs md:text-base font-semibold hover:shadow-lg duration-300`}
          >
            {t('earning.bankTransfer')}
          </Typography>
          <Typography
            onClick={() => {
              setPaymentType('e-wallet');
            }}
            className={`${
              paymentType === 'e-wallet'
                ? 'bg-white text-black shadow-lg '
                : 'bg-[#E9E9E9] text-[#BDBDBD]'
            } w-full flex justify-center items-center py-2 bg-white rounded-full cursor-pointer font-poppins text-xs md:text-base font-semibold hover:shadow-lg duration-300`}
          >
            E-Wallet
          </Typography>
        </div>

        {/* Bank Data */}
        <div className="w-full mt-4">
          <div className="mb-4">
            <Typography className="font-semibold font-poppins text-sm">
              {t('earning.accountName')}
            </Typography>
            <input
              id="search"
              type="text"
              name="search"
              value={accountName}
              onChange={e => {
                handleInputAccountName(e);
              }}
              placeholder={`${t('earning.enterAccountName')}`}
              className="border-b border-[#CCCCCC] block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9]"
            />
          </div>
          <div className="mb-4">
            <Typography className="font-semibold font-poppins text-sm">
              {paymentType === 'bank'
                ? t('earning.bankAccount')
                : t('earning.walletAccount')}
            </Typography>
            <div
              onClick={() => {
                handleOpenWithdrawList();
              }}
              className="w-full flex justify-between items-center border-b border-[#CCCCCC] pb-2 cursor-pointer"
            >
              <div>
                {(bankAccount?.payment_method ?? '') === '' ? (
                  <div className="text-[#CCCCCC]">
                    {t('earning.enterBankAccount')}
                  </div>
                ) : (
                  bankAccount?.payment_method
                )}
              </div>
              <div className="flex justify-center items-center w-[30px] h-[30px]">
                <Image
                  src={ArrowDownCollapse}
                  alt={'ArrowDown'}
                  width={100}
                  height={100}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <Typography className="font-semibold font-poppins text-sm">
              {t('earning.accountNumber')}
            </Typography>
            <input
              id="search"
              type="text"
              name="search"
              value={accountNumber}
              onChange={e => {
                handleInputAccountNumber(e);
              }}
              placeholder={`${t('earning.enterAccountNumber')}`}
              className="border-b border-[#CCCCCC] block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9]"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center rounded-xl p-5 bg-white gap-4 mt-4 mb-16">
        <div
          onClick={async () => {
            await router.push('/my-profile/my-earnings/withdraw-value');
          }}
          className="w-full py-2 md:py-4 flex justify-center items-center bg-seeds-button-green hover:shadow-lg text-white duration-300 cursor-pointer rounded-full font-poppins"
        >
          {t('earning.continue')}
        </div>
        <div
          onClick={async () => {
            await router.push('/my-profile/my-earnings');
          }}
          className="w-full py-2 md:py-4 flex justify-center items-center bg-white border border-[#E2E2E2] hover:bg-[#E2E2E2] hover:shadow-lg duration-300 cursor-pointer rounded-full font-poppins"
        >
          {t('earning.back')}
        </div>
      </div>
    </>
  );
};

export default withAuth(Withdraw);
