import CloseButtonWithdrawal from '@/assets/play/quiz/CloseButtonWithdrawal.svg';
import {
  Button,
  Dialog,
  DialogBody,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
interface IModalClaimMethod {
  open: boolean;
  handleOpen: () => void;
  setMethodList: (key: string, value: any) => void;
}

const ModalClaimMethod: React.FC<IModalClaimMethod> = ({
  open,
  handleOpen,
  setMethodList
}: IModalClaimMethod) => {
  const { t } = useTranslation();
  // Change this with API if any
  const method = [
    { name: 'Bank', subtitle: t('quiz.transferBank'), click: 'bank' },
    {
      name: t('quiz.eWallet'),
      subtitle: t('quiz.transferEWallet'),
      click: 'e-wallet'
    }
  ];
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
            {t('quiz.claimMethod')}
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

        <div className="flex flex-col gap-4 w-full">
          {method.map((value, index) => {
            return (
              <Button
                key={index}
                onClick={() => {
                  setMethodList('method', value.click?.toUpperCase());
                  setMethodList('account_name', '');
                  handleOpen();
                }}
                className="flex flex-col gap-2 w-full normal-case bg-[#F9F9F9] border-[#E9E9E9] border"
              >
                <Typography className="font-poppins font-semibold text-xs text-[#262626]">
                  {value.name}
                </Typography>
                <Typography className="font-poppins font-normal text-xs text-[#7C7C7C]">
                  {value.subtitle}
                </Typography>
              </Button>
            );
          })}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ModalClaimMethod;
