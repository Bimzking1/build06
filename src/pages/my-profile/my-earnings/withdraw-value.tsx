'use-client';

import CircleBackground from '@/assets/my-profile/earning/circleBackground.svg';
import Loading from '@/components/popup/Loading';
import { standartCurrency } from '@/helpers/currency';
import withAuth from '@/helpers/withAuth';
import {
  getEarningBalance,
  requestWithdraw
} from '@/repository/earning.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type RootState } from '@/store/earnings';
import { setWithdrawReceipt } from '@/store/earnings/successReceiptSlice';
import { type Result } from '@/utils/interfaces/earning.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface IRequestWithdraw {
  payment_method: string;
  account_name: string;
  account_number: string;
  nett_amount: number;
  fee: number;
}

const WithdrawValue = (): React.ReactElement => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [earning, setEarning] = useState<Result>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isLoadingEarn, setIsLoadingEarn] = useState<boolean>(false);
  const [withdrawValue, setWithdrawValue] = useState<number>();

  const { accountName, bankAccount, accountNumber } = useSelector(
    (state: RootState) => state?.withdraw ?? {}
  );

  const [form, setForm] = useState<IRequestWithdraw>({
    payment_method: bankAccount?.payment_method,
    account_name: accountName,
    account_number: accountNumber,
    nett_amount: 0,
    fee:
      bankAccount?.admin_fee +
      bankAccount?.service_fee -
      (bankAccount?.is_promo_available ? bankAccount?.promo_price : 0)
  });

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

  const handleInputWithdrawValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseFloat(event.target.value);
    setWithdrawValue(isNaN(value) ? 0 : value);
    setForm({ ...form, nett_amount: isNaN(value) ? 0 : value });
  };

  const handleRequestWithdraw = async (): Promise<void> => {
    try {
      const response = await requestWithdraw(form);
      dispatch(setWithdrawReceipt(response));
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      await router.push('/my-profile/my-earnings/withdraw-success');
    }
  };

  const withdrawTotal =
    (withdrawValue ?? 0) -
    (bankAccount?.admin_fee ?? 0) -
    (bankAccount?.service_fee ?? 0) +
    (bankAccount?.is_promo_available ?? false
      ? bankAccount?.promo_price ?? 0
      : 0);

  return (
    <>
      {isLoadingEarn && <Loading />}
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
              {userInfo?.preferredCurrency ?? 'IDR'}
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

        {/* Bank Data */}
        <div className="w-full mt-4">
          <Typography className="font-semibold font-poppins mb-4">
            {t('earning.withdrawAmount')}
          </Typography>
          <div className="bg-[#E9E9E9] p-4 rounded-lg">
            <div className="flex gap-2">
              {withdrawValue !== 0 && withdrawValue !== undefined && (
                <div className="text-[#262626] text-lg md:text-xl font-semibold">
                  {userInfo?.preferredCurrency ?? 'IDR'}
                </div>
              )}
              <input
                id="search"
                type="text"
                name="search"
                value={withdrawValue}
                placeholder={`${userInfo?.preferredCurrency ?? 'IDR'} - ${t(
                  'earning.nominalTransfer'
                )}`}
                onChange={e => {
                  handleInputWithdrawValue(e);
                }}
                className="block w-full text-[#262626] text-lg md:text-xl font-semibold placeholder:text-[#BDBDBD] focus:outline-0 bg-[#E9E9E9]"
              />
            </div>
            <div className="w-full text-[#3C49D6] text-sm">
              {t('earning.minimumWithdrawal')}{' '}
              {userInfo?.preferredCurrency ?? 'IDR'}
              {standartCurrency(10000).replace('Rp', '')}
            </div>
          </div>

          {/* Add ons details */}
          <div className="w-full px-5 mt-2">
            <div className="text-[#262626] font-semibold text-sm py-2">
              {t('earning.addOnsFee')}
            </div>

            {/* Provider */}
            <div className="flex w-full justify-between items-center py-2">
              <div className="text-[#BDBDBD] font-semibold text-sm">
                {t('earning.accountProvider')}
              </div>
              <div className="w-auto h-[22px] flex justify-end items-center">
                <img
                  alt="BlueWarning"
                  src={bankAccount?.logo_url ?? ''}
                  width={100}
                  height={100}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Withdraw Amount */}
            <div className="flex w-full justify-between items-center py-2">
              <div className="text-[#BDBDBD] font-semibold text-sm">
                {t('earning.withdrawAmount')}
              </div>
              <div
                className={`${
                  (withdrawValue ?? 0) < 10000 ||
                  (withdrawValue ?? 0) > (earning?.balance ?? 0)
                    ? 'text-[#DA2D1F]'
                    : 'text-[#262626]'
                } text-sm font-semibold text-right`}
              >
                {userInfo?.preferredCurrency ?? 'IDR'}
                {standartCurrency(withdrawValue ?? 0).replace('Rp', '')}
              </div>
            </div>

            {/* Admin Fee */}
            <div className="flex w-full justify-between items-center py-2">
              <div className="text-[#BDBDBD] font-semibold text-sm">
                {t('earning.adminFee')}
              </div>
              <div className="text-sm font-semibold text-right">
                {userInfo?.preferredCurrency ?? 'IDR'}
                {standartCurrency(bankAccount?.admin_fee ?? 0).replace(
                  'Rp',
                  ''
                )}
              </div>
            </div>

            {/* Service Fee */}
            <div className="flex w-full justify-between items-center py-2">
              <div className="text-[#BDBDBD] font-semibold text-sm">
                {t('earning.serviceFee')}
              </div>
              <div className="text-sm font-semibold text-right">
                {userInfo?.preferredCurrency ?? 'IDR'}
                {standartCurrency(bankAccount?.service_fee ?? 0).replace(
                  'Rp',
                  ''
                )}
              </div>
            </div>

            {/* Discount */}
            {bankAccount?.is_promo_available && (
              <div className="flex w-full justify-between items-center py-2">
                <div className="text-[#BDBDBD] font-semibold text-sm">
                  {t('earning.discount')}
                </div>
                <div className="text-sm font-semibold text-right">
                  {`- ${userInfo?.preferredCurrency ?? 'IDR'}${standartCurrency(
                    bankAccount?.promo_price ?? 0
                  ).replace('Rp', '')}`}
                </div>
              </div>
            )}

            {/* Total Amount */}
            <div className="flex w-full justify-between items-center py-2 pt-4 border-t border-[#BDBDBD] mt-2">
              <div className="text-[#BDBDBD] font-semibold text-sm">
                {withdrawTotal < 0
                  ? t('earning.balanceWithdrawn')
                  : t('earning.totalAmount')}
              </div>
              <div
                className={`${
                  (withdrawValue ?? 0) > (earning?.balance ?? 0)
                    ? 'text-[#DA2D1F]'
                    : 'text-[#262626]'
                } text-sm font-semibold text-right`}
              >
                {userInfo?.preferredCurrency ?? 'IDR'}
                {standartCurrency(withdrawTotal ?? 0).replace('Rp', '')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center rounded-xl p-5 bg-white gap-4 mt-4 mb-16">
        <button
          onClick={() => {
            void handleRequestWithdraw();
          }}
          disabled={
            !(
              (withdrawValue ?? 0) >= 10000 &&
              (withdrawValue ?? 0) <= (earning?.balance ?? 0)
            )
          }
          className={`${
            (withdrawValue ?? 0) >= 10000 &&
            (withdrawValue ?? 0) <= (earning?.balance ?? 0)
              ? 'bg-seeds-button-green'
              : 'bg-[#BDBDBD] disabled'
          } w-full py-2 md:py-4 flex justify-center items-center hover:shadow-lg text-white duration-300 cursor-pointer rounded-full font-poppins`}
        >
          {t('earning.confirm')}
        </button>
        <div
          onClick={async () => {
            await router.push('/my-profile/my-earnings/withdraw');
          }}
          className="w-full py-2 md:py-4 flex justify-center items-center bg-white hover:bg-[#E2E2E2] border border-[#E2E2E2] hover:shadow-lg duration-300 cursor-pointer rounded-full font-poppins"
        >
          {t('earning.back')}
        </div>
      </div>
    </>
  );
};

export default withAuth(WithdrawValue);
