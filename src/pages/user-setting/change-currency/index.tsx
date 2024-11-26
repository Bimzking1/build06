import CCard from '@/components/CCard';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { getMarketCurrency } from '@/repository/market.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { updatePreferredCurrency } from '@/repository/user.repository';
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  Typography
} from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
interface CurrencyDTO {
  name: string;
  short_code: string;
  logo: string;
}

const ChangeCurrency: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>();
  const [listCurrency, setListCurrency] = useState<CurrencyDTO[]>([]);
  const [currency, setCurrency] = useState<string>('');
  const submitPreferredCurrency = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await updatePreferredCurrency(currency);
      await router.push('/user-setting');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchListCurrency = async (): Promise<void> => {
    try {
      const response = await getMarketCurrency();
      setListCurrency(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const myData = await getUserInfo();
        setUserInfo(myData);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});

    void fetchListCurrency();
  }, []);

  useEffect(() => {
    if (userInfo !== undefined) {
      setCurrency(userInfo?.preferredCurrency as string);
    }
  }, [userInfo]);

  return (
    <PageGradient defaultGradient className="w-full">
      {isLoading && <Loading />}
      <CCard className="flex flec-col p-4 md:p-5 mt-5 md:rounded-lg border-none rounded-none pb-5">
        <div className="flex justify-start items-center gap-2">
          <Typography className="font-semibold font-poppins text-[#262626]">
            Select a Currency
          </Typography>
          <Menu placement="bottom">
            <MenuHandler>
              <button className="flex items-center" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                    stroke="#3C49D6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12V9"
                    stroke="#3C49D6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 6H9.0075"
                    stroke="#3C49D6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </MenuHandler>
            <MenuList className="rounded-2xl">
              <div className="flex flex-col p-2 max-w-[300px]">
                <div className="flex justify-between">
                  <Typography className="font-semibold text-xs font-poppins text-[#3AC4A0]">
                    Info
                  </Typography>
                </div>
                <Typography className="font-normal text-xs font-poppins text-[#262626] mt-2">
                  All the transaction with real money{' '}
                  <span className="font-semibold">(Pay and Claim Reward)</span>{' '}
                  will be using IDR.
                </Typography>
              </div>
            </MenuList>
          </Menu>
        </div>
        <div className="flex justify-start mt-1">
          <Typography className="font-normal text-sm font-poppins text-[#7C7C7C]">
            Choose your preferred currency
          </Typography>
        </div>
        <div className="flex flex-col gap-4 mt-4 overflow-auto">
          {listCurrency.map((el: CurrencyDTO, idx: number) => {
            return (
              <Button
                variant={currency === el.short_code ? 'outlined' : 'filled'}
                className={`flex justify-between p-3 ${
                  currency === el.short_code
                    ? 'bg-[#DCFCE4] border-[#3AC4A0] shadow-md'
                    : 'bg-[#F9FAFD] shadow-none'
                } rounded-2xl border`}
                onClick={() => {
                  setCurrency(el.short_code);
                }}
                key={idx}
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={el.logo}
                    alt="Currency"
                    className="cursor-pointer w-9 h-9"
                  />
                  <Typography className="font-normal text-sm font-poppins text-[#262626] normal-case">
                    {el.name}
                  </Typography>
                </div>
              </Button>
            );
          })}
        </div>
        <div className="flex justify-center">
          <Button
            className="rounded-full min-w-full md:min-w-[400px] max-w-[500px] capitalize font-semibold text-sm bg-[#3AC4A0] text-white font-poppins mt-4"
            onClick={() => {
              submitPreferredCurrency().catch(err => {
                console.log(err);
              });
            }}
          >
            {t('chooseCurrency.buttonSuccess')}
          </Button>
        </div>
      </CCard>
    </PageGradient>
  );
};

export default withAuth(ChangeCurrency);
