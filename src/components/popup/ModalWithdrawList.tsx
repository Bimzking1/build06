/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use client';
import IconNoData from '@/assets/play/tournament/noData.svg';
import { standartCurrency } from '@/helpers/currency';
import { setBankAccount } from '@/store/earnings/withdrawSlice';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { type Type_VA } from '@/utils/interfaces/withdraw.interfaces';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  userInfo: UserInfo;
  listVA: Type_VA[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  paymentType: string;
}

interface PayAttibutes {
  admin_fee: number;
  id: string;
  is_active: boolean;
  is_priority: boolean;
  is_promo_available: boolean;
  logo_url: string;
  minimum_withdrawal: number;
  payment_gateway: string;
  payment_method: string;
  payment_type: string;
  promo_price: number;
  service_fee: number;
}

const ModalWithdrawList: React.FC<Props> = ({
  onClose,
  userInfo,
  listVA,
  searchQuery,
  setSearchQuery,
  paymentType
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  const handleChooseMethod = (paymentAttributes: PayAttibutes): void => {
    try {
      dispatch(setBankAccount(paymentAttributes));
    } catch (error) {
      toast(`Error choosing method: ${error as string}`);
    } finally {
      onClose();
    }
  };
  return (
    <>
      <Modal
        onClose={onClose}
        backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
        modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[40%] md:left-[10%] md:right-[-10%] xl:left-[22.5%] xl:right-[-22.5%] mt-[-12.35rem] w-full md:w-[80%] xl:w-[60%] h-[70vh] md:h-[50vh] p-4 rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white overflow-y-scroll"
      >
        {/* Title */}
        <div className="flex justify-between">
          <Typography className="font-bold text-lg text-[#3AC4A0]">
            {paymentType === 'bank'
              ? t('earning.bankAccountList')
              : t('earning.eWalletList')}
          </Typography>
          <Image
            src={XIcon}
            alt="X"
            width={30}
            height={30}
            onClick={onClose}
            className="hover:scale-110 transition ease-out cursor-pointer"
          />
        </div>

        {/* Search */}
        <div className="w-full flex gap-2 mt-4">
          <input
            id="search"
            type="text"
            name="search"
            value={searchQuery}
            onChange={e => {
              handleSearch(e);
            }}
            placeholder={
              paymentType === 'bank'
                ? `${t('earning.searchBankAccount')}`
                : `${t('earning.searchWallet')}`
            }
            className="block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 pl-8 rounded-xl border border-[#BDBDBD]"
          />
        </div>

        <div className="w-full flex flex-col mt-4 overflow-y-scroll">
          {listVA?.length !== 0 ? (
            listVA?.map(item => (
              <div
                key={item?.id}
                onClick={() => {
                  handleChooseMethod(item);
                }}
                className="w-full px-8 py-4 border-b border-[#E2E2E2] font-poppins hover:bg-[#E2E2E2] hover:shadow-lg duration-300 cursor-pointer rounded-lg"
              >
                <div>
                  <div className="w-fit h-[30px] flex justify-center items-center">
                    <Image
                      src={item?.logo_url}
                      alt="payment_logo"
                      width={100}
                      height={100}
                      className="w-fit h-full"
                    />
                  </div>
                  <div className="font-normal text-xs md:text-sm mt-1 text-[#27A590]">
                    {t('earning.adminFee')}:{' '}
                    {userInfo?.preferredCurrency !== undefined
                      ? userInfo?.preferredCurrency
                      : 'IDR'}
                    {standartCurrency(item?.admin_fee ?? 0).replace('Rp', '')}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0 mb-16">
              <Image alt="" src={IconNoData} className="w-[250px]" />
              <p className="font-semibold text-black">
                {`"${searchQuery}" ${t('earning.notFound')}`}
              </p>
              <p className="text-[#7C7C7C]">{t('earning.otherKeyword')}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalWithdrawList;
