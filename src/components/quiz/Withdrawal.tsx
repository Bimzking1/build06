import Dropdown from '@/assets/play/quiz/Dropdown.svg';
import RewardClaimed from '@/assets/play/quiz/rewards-claimed.png';
import ModalAccountList from '@/components/quiz/ModalAccountList';
import ModalClaimMethod from '@/components/quiz/ModalClaimMethod';
import SettingCommonInput from '@/components/setting/accountInformation/SettingCommonInput';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { type IWithdrawalAccount } from '@/pages/withdrawal';
import { getWithdrawalList } from '@/repository/payment.repository';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Loading from '../popup/Loading';

export interface IAccountList {
  id: string;
  payment_gateway: string;
  payment_method: string;
  logo_url: string;
  payment_type: string;
  admin_fee: number;
  service_fee: number;
  promo_price: number;
  is_active: boolean;
  is_promo_available: boolean;
  is_priority: boolean;
}
interface IIndexWithdrawal {
  setSelect: Dispatch<SetStateAction<number>>;
  className: string;
  setSelectedAccount: Dispatch<SetStateAction<IWithdrawalAccount | undefined>>;
  account: IWithdrawalAccount | undefined;
}

const IndexWithdrawal: React.FC<IIndexWithdrawal> = ({
  setSelect,
  className,
  setSelectedAccount,
  account
}: IIndexWithdrawal) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openAccountList, setOpenAccountList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bankList, setBankList] = useState([]);
  const [eWalletList, setEWalletList] = useState([]);
  const handleOpen = (): void => {
    setOpen(!open);
  };
  const handleOpenAccountList = (): void => {
    setOpenAccountList(!openAccountList);
  };

  const handleSelectAccount = (key: string, value: string): void => {
    setSelectedAccount((prevState: any) => ({
      ...prevState,
      [key]: value
    }));
  };

  const isFormComplete = (): boolean => {
    return (
      account?.method?.trim() !== '' &&
      account?.account_name?.trim() !== '' &&
      (account?.beneficiary_name?.trim() ?? '').length >= 5 &&
      (account?.account_number?.trim() ?? '').length >= 5
    );
  };

  const fetchWithdrawalMethodList = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getWithdrawalList();
      setBankList(data.type_va);
      setEWalletList(data.type_ewallet);
    } catch (error: any) {
      toast(`Error fetching Payment List: ${error.message as string}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchWithdrawalMethodList();
  }, []);

  const renderContent = (): JSX.Element => (
    <Card shadow={false} className={`${className} p-5 gap-4 items-center`}>
      <div className="flex flex-col items-center gap-6">
        <Typography className="font-poppins font-semibold md:text-3xl text-2xl text-[#262626]">
          {t('quiz.congratulation')}
        </Typography>
        <Image
          src={RewardClaimed}
          alt="RewardClaimed"
          className="md:w-[298.46px] md:h-[255.18px] w-[233.92px] h-[200px]"
        />
        <Typography className="font-poppins font-normal md:text-lg text-sm text-[#7C7C7C]">
          {t('quiz.cashOut')}
        </Typography>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <SettingCommonInput
          divClassName="relative flex flex-col w-full"
          extraClassesTop={
            <Image
              src={Dropdown}
              alt="Dropdown"
              className="absolute right-0 p-0 pb-[7px] pt-[14px]"
            />
          }
          label={t('quiz.claimMethod')}
          name=""
          placeholder={`${t('quiz.placeholderMethod')}`}
          value={account?.method ?? ''}
          onChange={() => {}}
          className="!text-[#7C7C7C] !text-base !font-poppins !font-normal"
          readOnly={true}
          onClick={handleOpen}
        />
        <SettingCommonInput
          divClassName="relative flex flex-col w-full"
          extraClassesTop={
            <Image
              src={Dropdown}
              alt="Dropdown"
              className="absolute right-0 p-0 pb-[7px] pt-[14px]"
            />
          }
          label={t('quiz.account')}
          name=""
          placeholder={`${t('quiz.placeholderAccount')}`}
          value={account?.account_name ?? ''}
          onChange={() => {}}
          className="!text-[#7C7C7C] !text-base !font-poppins !font-normal"
          readOnly={true}
          onClick={handleOpenAccountList}
        />
        <SettingCommonInput
          divClassName="w-full"
          label={t('quiz.accountName')}
          name=""
          placeholder={`${t('quiz.placeholderAccountName')}`}
          value={account?.beneficiary_name ?? ''}
          onChange={data => {
            handleSelectAccount('beneficiary_name', data.target.value);
          }}
          className="!text-[#7C7C7C] !text-base !font-poppins !font-normal"
        />
        <SettingCommonInput
          divClassName="w-full"
          label={t('quiz.accountNumber')}
          name=""
          placeholder={`${t('quiz.placeholderAccountNumber')}`}
          value={account?.account_number ?? ''}
          onChange={data => {
            handleSelectAccount('account_number', data.target.value);
          }}
          className="!text-[#7C7C7C] !text-base !font-poppins !font-normal"
        />
      </div>
      <Button
        onClick={() => {
          setSelect(1);
        }}
        disabled={!isFormComplete()}
        className="capitalize disabled:bg-[#BDBDBD] disabled:text-[#7C7C7C] bg-[#3AC4A0] text-[#FFFFFF] rounded-full font-poppins font-semibold text-sm md:w-[343px] w-full"
      >
        {t('quiz.submit')}
      </Button>
    </Card>
  );
  const renderLoading = (): JSX.Element => <Loading />;

  return (
    <PageGradient defaultGradient className="w-full">
      {loading ? renderLoading() : renderContent()}
      <ModalClaimMethod
        open={open}
        handleOpen={handleOpen}
        setMethodList={handleSelectAccount}
      />
      <ModalAccountList
        open={openAccountList}
        handleOpen={handleOpenAccountList}
        setAccount={handleSelectAccount}
        methodList={account?.method ?? 'BANK'}
        bankList={bankList}
        eWalletList={eWalletList}
      />
    </PageGradient>
  );
};

export default IndexWithdrawal;
