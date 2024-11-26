'use-client';

import BlueWarning from '@/assets/my-profile/earning/blueWarning.svg';
import SuccessIcon from '@/assets/my-profile/earning/successIcon.svg';
import UpperMotive from '@/assets/my-profile/earning/upperMotive.svg';
import { standartCurrency } from '@/helpers/currency';
import { getEarningReceiptDate } from '@/helpers/dateFormat';
import withAuth from '@/helpers/withAuth';
import { getUserInfo } from '@/repository/profile.repository';
import { type RootState } from '@/store/earnings';
import { resetWithdrawReceipt } from '@/store/earnings/successReceiptSlice';
import LanguageContext from '@/store/language/language-context';
import { type UserInfo } from '@/utils/interfaces/earning.interfaces';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const WithdrawSuccess = (): React.ReactElement => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const languageCtx = useContext(LanguageContext);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const { withdrawReceipt } = useSelector(
    (state: RootState) => state?.successReceipt ?? {}
  );
  const { bankAccount } = useSelector(
    (state: RootState) => state?.withdraw ?? {}
  );

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});

    return () => {
      dispatch(resetWithdrawReceipt());
    };
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center rounded-xl p-5 bg-white">
        {/* Receipt Container */}
        <div>
          {/* Upper Sector */}
          <div className="rounded-t-3xl relative bg-[#3AC4A0] flex justify-center items-center p-12 overflow-hidden">
            <div className="w-full flex flex-col justify-center items-center">
              <div className="w-[60px] h-[60px]">
                <Image
                  alt="SuccessIcon"
                  src={SuccessIcon}
                  width={100}
                  height={100}
                  className="w-full h-full"
                />
              </div>
              <div className="text-white font-semibold text-2xl my-2">
                {t('earning.thankYou')}
              </div>
              <div className="text-white text-center">
                {t('earning.withdrawalProcessed')}
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-3/4 h-auto flex justify-center items-center">
              <Image
                alt="UpperMotive"
                src={UpperMotive}
                width={100}
                height={100}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Lower Sector */}
          <div className="p-4 md:p-5">
            <div className="text-[#3AC4A0] font-semibold text-xl">
              {t('earning.transactionDetails')}
            </div>
            <div className="relative p-2 md:p-5 rounded-t-2xl shadow-lg mt-4">
              <div className="absolute top-[90px] left-[-10px] bg-white w-[20px] h-[20px] rounded-full" />
              <div className="absolute top-[90px] right-[-10px] bg-white w-[20px] h-[20px] rounded-full" />

              {/* Date */}
              <div className="flex w-full justify-between items-center py-2">
                <div className="text-[#BDBDBD] font-semibold text-sm md:text-base">
                  {t('earning.date')}
                </div>
                <div className="text-sm md:text-base font-semibold text-right">
                  {languageCtx?.language === 'ID'
                    ? getEarningReceiptDate(
                        new Date(
                          withdrawReceipt?.created_at ??
                            '2024-12-31T00:00:00.314412Z'
                        ),
                        'id-ID'
                      )
                    : getEarningReceiptDate(
                        new Date(
                          withdrawReceipt?.created_at ??
                            '2024-12-31T00:00:00.314412Z'
                        ),
                        'en-US'
                      )}
                </div>
              </div>

              {/* Reference Number */}
              <div className="flex w-full justify-between items-center border-b border-[#BDBDBD] border-dashed py-2 pb-4">
                <div className="text-[#BDBDBD] font-semibold text-sm md:text-base">
                  {t('earning.referenceNumber')}
                </div>
                <div className="text-sm md:text-base font-semibold text-right">
                  {withdrawReceipt?.id ?? 'Loading...'}
                </div>
              </div>

              {/* Withdraw */}
              <div className="flex w-full justify-between items-center py-2 pt-4">
                <div className="text-[#BDBDBD] font-semibold text-sm md:text-base">
                  {t('earning.withdrawAmount')}
                </div>
                <div className="text-sm md:text-base font-semibold text-right">
                  {userInfo?.preferredCurrency !== undefined
                    ? userInfo?.preferredCurrency
                    : 'IDR'}
                  {standartCurrency(withdrawReceipt?.nett_amount ?? 0).replace(
                    'Rp',
                    ''
                  )}
                </div>
              </div>

              {/* Admin Fee */}
              <div className="flex w-full justify-between items-center py-2">
                <div className="text-[#BDBDBD] font-semibold text-sm md:text-base">
                  {t('earning.adminFee')}
                </div>
                <div className="text-sm md:text-base font-semibold text-right">
                  {userInfo?.preferredCurrency !== undefined
                    ? userInfo?.preferredCurrency
                    : 'IDR'}
                  {standartCurrency(bankAccount?.admin_fee ?? 0).replace(
                    'Rp',
                    ''
                  )}
                </div>
              </div>

              {/* Service Fee */}
              <div className="flex w-full justify-between items-center py-2">
                <div className="text-[#BDBDBD] font-semibold text-sm md:text-base">
                  {t('earning.serviceFee')}
                </div>
                <div className="text-sm md:text-base font-semibold text-right">
                  {userInfo?.preferredCurrency !== undefined
                    ? userInfo?.preferredCurrency
                    : 'IDR'}
                  {standartCurrency(bankAccount?.service_fee ?? 0).replace(
                    'Rp',
                    ''
                  )}
                </div>
              </div>

              {/* Discount */}
              {bankAccount?.is_promo_available && (
                <div className="flex w-full justify-between items-center py-2">
                  <div className="text-[#BDBDBD] font-semibold text-sm md:text-base">
                    {t('earning.discount')}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-right">
                    {`- ${
                      userInfo?.preferredCurrency !== undefined
                        ? userInfo?.preferredCurrency
                        : 'IDR'
                    }${standartCurrency(bankAccount?.promo_price ?? 0).replace(
                      'Rp',
                      ''
                    )}`}
                  </div>
                </div>
              )}

              {/* Total Amount */}
              <div className="flex w-full justify-between items-center py-2 pt-4 border-t border-[#BDBDBD] mt-2">
                <div className="text-[#BDBDBD] font-semibold text-sm md:text-base">
                  {t('earning.totalAmount')}
                </div>
                <div className="text-sm md:text-base font-semibold text-right">
                  {userInfo?.preferredCurrency !== undefined
                    ? userInfo?.preferredCurrency
                    : 'IDR'}
                  {standartCurrency(
                    (withdrawReceipt?.nett_amount ?? 0) +
                      (bankAccount?.admin_fee ?? 0) +
                      (bankAccount?.service_fee ?? 0) -
                      (bankAccount?.is_promo_available ?? 0
                        ? bankAccount?.promo_price ?? 0
                        : 0)
                  ).replace('Rp', '')}
                </div>
              </div>
            </div>
            <div className="flex w-full justify-start items-center mt-4">
              <div className="w-[14px] h-[14px] flex justify-center items-center mr-2">
                <Image
                  alt="BlueWarning"
                  src={BlueWarning}
                  width={100}
                  height={100}
                  className="w-full h-full"
                />
              </div>
              <div className="text-[#5263F9] mt-1 md:mt-0 text-sm md:text-base">
                {t('earning.withdrawalWarning')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center rounded-xl p-5 bg-white mt-4 gap-4">
        <div
          onClick={async () =>
            await router.push(
              `/my-profile/my-earnings/withdraw-status/${
                withdrawReceipt?.id ?? '0'
              }`
            )
          }
          className="w-full py-2 md:py-4 bg-[#3AC4A0] text-white text-semibold flex justify-center items-center rounded-full text-sm md:text-base cursor-pointer hover:shadow-lg duration-300"
        >
          {t('earning.checkStatus')}
        </div>
        <div
          onClick={async () => await router.push('/my-profile/my-earnings')}
          className="w-full py-2 md:py-4 bg-white text-[#3AC4A0] border-[1px] border-[#3AC4A0] text-semibold flex justify-center items-center rounded-full text-sm md:text-base cursor-pointer hover:shadow-lg duration-300"
        >
          {t('earning.myEarnings')}
        </div>
      </div>
    </>
  );
};

export default withAuth(WithdrawSuccess);
