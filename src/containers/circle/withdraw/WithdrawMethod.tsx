import CCard from '@/components/CCard';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import {
  Button,
  Card,
  CardBody,
  Input,
  Option,
  Select,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';

interface FormRequest {
  method: string;
  account_name: string;
  account_number: string;
  amount: number;
  pin: string[];
}

interface RequiredForm {
  nominal: string;
  method: string;
  bankAccount: string;
  accountNumber: string;
  accountName: string;
}

interface props {
  changeStep: any;
  isLoadingBalance: boolean;
  balance: number;
  changeValueMethod: any;
  formRequest: FormRequest;
  changeValueAccountName: any;
  changeValue: any;
  formRequired: RequiredForm;
}

const WithdrawMethod: React.FC<props> = ({
  changeStep,
  balance,
  isLoadingBalance,
  formRequest,
  changeValueMethod,
  changeValueAccountName,
  changeValue,
  formRequired
}) => {
  const width = useWindowInnerWidth();
  const { t } = useTranslation();
  // const [eWalletOptions, setEWalletOptions] = useState<any[]>([]);
  // const [bankOptions, setBankOptions] = useState<any[]>([]);

  const eWalletOptions = ['GOPAY', 'OVO'];
  const bankOptions = ['BANK BRI', 'BANK BCA', 'BANK BNI', 'BANK MANDIRI'];

  const placeholderMethod = (): string => {
    if (formRequest.method === 'bank') {
      return 'BANK';
    } else if (formRequest.method === 'e-wallet') {
      return 'E-WALLET';
    } else {
      return `${t('circle.withdraw.method.method.placeholder')}`;
    }
  };

  const placeholderBankAccount = (): string => {
    if (formRequest.account_name === '') {
      return `${t('circle.withdraw.method.bankRekening.placeholder')}`;
    }

    return formRequest.account_name;
  };

  return (
    <PageGradient
      defaultGradient
      className="relative overflow-hidden flex flex-col items-center sm:p-0 sm:pb-16 w-full"
    >
      <CardGradient
        defaultGradient
        className={`relative overflow-hidden w-full sm:rounded-[18px] sm:min-h-[36rem] bg-white sm:px-20 py-8 ${
          width !== undefined && width < 370
            ? 'min-h-[38rem]'
            : width !== undefined && width < 400
            ? 'min-h-[45rem]'
            : width !== undefined && width < 415
            ? 'min-h-[48rem]'
            : ''
        } bg-white`}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            className="w-1/3 items-start text-left transition-colors rounded-md hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:bg-gray-200"
            onClick={() => changeStep('asd')}
          >
            <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
          </button>
          <Typography className="mb-2 text-center text-lg font-poppins w-1/3 font-semibold">
            Withdraw Method
          </Typography>
          <p className="w-1/3"></p>
        </div>
        <div className="flex items-center justify-center rounded-xl">
          <CCard className="p-9 border-none rounded-none shadow-none w-full bg-white md:mx-4 lg:mx-10 xl:mx-[10rem]">
            <Card className="bg-[#8a70e0] h-full">
              <CardBody>
                <Typography color="white" className="text-base font-normal">
                  {t('circle.banner.title3')}
                </Typography>
                <Typography color="white" className="text-2xl font-semibold">
                  {isLoadingBalance ? 'Loading...' : `IDR ${balance}`}
                </Typography>
              </CardBody>
            </Card>
            <div className="my-8">
              <label className="font-semibold text-base text-[#262626]">
                {t('circle.withdraw.method.method.label')}
              </label>
              <Select
                variant="standard"
                selected={placeholderMethod}
                onChange={changeValueMethod}
                name="method"
              >
                <Option value="bank">
                  <Typography className="text-[#262626]">
                    {t('circle.withdraw.method.popUp.title1')}
                  </Typography>
                  <Typography className="text-[#262626]">
                    {t('circle.withdraw.method.popUp.subtitle1')}
                  </Typography>
                </Option>
                <Option value="e-wallet">
                  <Typography className="text-[#262626]">
                    {t('circle.withdraw.method.popUp.title2')}
                  </Typography>
                  <Typography className="text-[#262626]">
                    {t('circle.withdraw.method.popUp.subtitle2')}
                  </Typography>
                </Option>
              </Select>
              {formRequired.method !== '' && (
                <small className="text-[#ff515d] font-bold">
                  {formRequired.method}
                </small>
              )}
            </div>
            <div className="mb-8">
              <label className="font-semibold text-base text-[#262626]">
                {t('circle.withdraw.method.bankRekening.label')}
              </label>
              <Select
                variant="standard"
                selected={placeholderBankAccount}
                onChange={changeValueAccountName}
                name="account_name"
              >
                {formRequest.method === 'bank'
                  ? bankOptions.map((data, idx) => (
                      <Option value={data} key={idx}>
                        <Typography className="text-[#262626]">
                          {data}
                        </Typography>
                      </Option>
                    ))
                  : eWalletOptions.map((data, idx) => (
                      <Option value={data} key={idx}>
                        <Typography className="text-[#262626]">
                          {data}
                        </Typography>
                      </Option>
                    ))}
              </Select>
              {formRequired.bankAccount !== '' && (
                <small className="text-[#ff515d] font-bold">
                  {formRequired.bankAccount}
                </small>
              )}
            </div>
            <div className="mb-8">
              <label className="font-semibold text-base text-[#262626]">
                {t('circle.withdraw.method.numberRekening.label')}
              </label>
              <Input
                variant="static"
                color="green"
                name="account_number"
                onChange={changeValue}
                value={formRequest.account_number}
                placeholder={`${t(
                  'circle.withdraw.method.numberRekening.placeholder'
                )}`}
              />
              {formRequired.accountNumber !== '' && (
                <small className="text-[#ff515d] font-bold">
                  {formRequired.accountNumber}
                </small>
              )}
            </div>
            <div className="mb-8">
              <label className="font-semibold text-base text-[#262626]">
                {t('circle.withdraw.method.nameRekening.label')}
              </label>
              <Input
                variant="static"
                color="green"
                type="text"
                name="account_name"
                // onChange={change}
                // value={formRequest.account_name}
                placeholder={`${t(
                  'circle.withdraw.method.nameRekening.placeholder'
                )}`}
              />
              {formRequired.accountName !== '' && (
                <small className="text-[#ff515d] font-bold">
                  {formRequired.accountName}
                </small>
              )}
            </div>

            <div className="w-full flex items-center justify-center">
              <Button
                className="w-1/2 bg-seeds-button-green mt-5 rounded-full capitalize"
                onClick={() => changeStep('pin')}
              >
                {t('circle.withdraw.method.button')}
              </Button>
            </div>
          </CCard>
        </div>
      </CardGradient>
    </PageGradient>
  );
};

export default WithdrawMethod;
