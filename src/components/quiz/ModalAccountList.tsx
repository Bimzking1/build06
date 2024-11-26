import CloseButtonWithdrawal from '@/assets/play/quiz/CloseButtonWithdrawal.svg';
import { Dialog, DialogBody, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { type IAccountList } from './Withdrawal';

interface IModalAccountList {
  open: boolean;
  handleOpen: () => void;
  setAccount: (key: string, value: any) => void;
  methodList: string;
  bankList: IAccountList[];
  eWalletList: IAccountList[];
}

const ModalAccountList: React.FC<IModalAccountList> = ({
  open,
  handleOpen,
  setAccount,
  methodList,
  bankList,
  eWalletList
}: IModalAccountList) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="lg"
      className="p-4 md:p-5 flex flex-col items-center md:relative absolute bottom-0 m-0 rounded-t-3xl rounded-b-none md:rounded-2xl min-w-full"
    >
      <DialogBody className="flex flex-col items-center md:gap-5 gap-4 p-0 w-full">
        <div className="flex md:hidden w-[100px] h-[5px] rounded-full bg-[#E9E9E9]"></div>
        <div className="hidden md:flex justify-between items-center w-full">
          <Typography className="font-poppins font-semibold text-lg text-[#262626]">
            {methodList === 'bank' ? t('quiz.bankList') : t('quiz.eWalletList')}
          </Typography>
          <Image
            src={CloseButtonWithdrawal}
            alt="CloseButtonWithdrawal"
            className="cursor-pointer z-10"
            onClick={() => {
              handleOpen();
            }}
          />
        </div>

        <div className="flex flex-col w-full h-[244px] overflow-auto">
          {(methodList === 'BANK' ? bankList : eWalletList).map(
            (value, index) => {
              const data = value.payment_method?.split('_').reverse().join(' ');
              return (
                <div
                  onClick={() => {
                    setAccount('account_name', data);
                    handleOpen();
                  }}
                  key={index}
                  className="w-full bg-transparent border-[#E9E9E9] border-b rounded-none px-4 pt-4 pb-1.5 md:py-3 cursor-pointer"
                >
                  <Typography className="font-poppins font-semibold text-base md:text-lg text-[#262626] text-start">
                    {data}
                  </Typography>
                </div>
              );
            }
          )}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ModalAccountList;
