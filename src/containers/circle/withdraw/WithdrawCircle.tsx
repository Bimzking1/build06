import CCard from '@/components/CCard';
import CardIncome from '@/components/circle/CardIncome';
import { SearchCircle } from '@/components/forms/searchCircle';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { getCircleIncome } from '@/repository/circle.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Card,
  CardBody,
  Input,
  Typography
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
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
  changeValue: any;
  formRequest: FormRequest;
  requiredForm: RequiredForm;
}

interface Income {
  id: string;
  name: string;
  avatar: string;
  income: number;
}

const initialFilter = {
  page: 1,
  limit: 10,
  search: ''
};

const WithdrawCircle: React.FC<props> = ({
  changeStep,
  balance,
  isLoadingBalance,
  formRequest,
  changeValue,
  requiredForm
}) => {
  const [userInfo, setUserInfo] = useState<any>();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();

        setUserInfo(dataInfo);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);
  const width = useWindowInnerWidth();
  const [isLoading, setIsLoading] = useState(false);
  const [incomes, setIncomes] = useState<Income[]>();
  const [filter, setFilter] = useState(initialFilter);
  const { t } = useTranslation();

  const handleChangeFilter = (event: any): void => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFilter(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchCircleIncome = async (): Promise<void> => {
    try {
      setIsLoading(true);
      getCircleIncome(filter)
        .then(res => {
          setIncomes(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          if (err.response.status === 404) {
            setIncomes([]);
          }
          setIsLoading(false);
        });
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  useEffect(() => {
    void fetchCircleIncome();
  }, [filter]);

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
        <div className="flex items-center justify-center rounded-xl">
          <CCard className="p-9 border-none rounded-none shadow-none w-full bg-white md:mx-4 lg:mx-10 xl:mx-[10rem]">
            <Card className="bg-[#8a70e0] h-full">
              <CardBody>
                <Typography color="white" className="text-base font-normal">
                  {t('circle.banner.title3')}
                </Typography>
                <Typography color="white" className="text-2xl font-semibold">
                  {isLoadingBalance
                    ? 'Loading...'
                    : `${
                        userInfo?.preferredCurrency as string
                      } ${balance.toFixed(2)}`}
                </Typography>
              </CardBody>
            </Card>
            <div className="my-8">
              <label className="font-semibold text-base text-[#262626]">
                {t('circle.withdraw.method.input')}
              </label>
              <Input
                variant="static"
                color="green"
                name="amount"
                onChange={changeValue}
                value={formRequest.amount}
                placeholder={`${userInfo?.preferredCurrency as string} 0`}
              />
              <hr />
              {requiredForm.nominal !== '' && (
                <small className="text-[#ff515d] font-bold">
                  {requiredForm.nominal}
                </small>
              )}
            </div>
            <label className="font-semibold text-base mb-2 text-[#262626]">
              List Circle
            </label>
            <form className="w-full mb-10">
              <SearchCircle
                name="search"
                type="outline"
                prefix={
                  <MagnifyingGlassIcon className="w-5 h-5 text-[#262626]" />
                }
                onChange={e => {
                  handleChangeFilter(e);
                }}
                placeholder="Search"
                value={filter.search}
              />
            </form>

            <div className="overflow-x-auto h-80">
              {!isLoading ? (
                incomes?.length !== 0 ? (
                  incomes?.map((data, idx) => (
                    <CardIncome data={data} key={idx} />
                  ))
                ) : (
                  <div className="flex flex-row items-center justify-center w-full p-4 rounded-none bg-[#F9F9F9]">
                    <Typography className="text-sm font-semibold text-[#262626]">
                      Data Not Found
                    </Typography>
                  </div>
                )
              ) : (
                <div className="flex flex-row items-center justify-center w-full p-4 rounded-none bg-[#F9F9F9]">
                  <Typography className="text-sm font-semibold text-[#262626]">
                    Loading...
                  </Typography>
                </div>
              )}
            </div>

            <div className="w-full flex items-center justify-center">
              <Button
                className="w-1/2 bg-seeds-button-green mt-10 rounded-full capitalize"
                onClick={() => changeStep('method')}
              >
                Continue
              </Button>
            </div>
          </CCard>
        </div>
      </CardGradient>
    </PageGradient>
  );
};

export default WithdrawCircle;
