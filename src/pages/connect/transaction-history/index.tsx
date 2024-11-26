import CCard from '@/components/CCard';
import CardTransaction from '@/components/circle/CardTransaction';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import {
  getCircleBalance,
  getCircleTransactionIn,
  getCircleTransactionOut
} from '@/repository/circle.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  Card,
  CardBody,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const initialFilterIncome = {
  page: 1,
  limit: 100
};

const initialFilterOutcome = {
  page: 1,
  limit: 100,
  status: ''
};

interface Transaction {
  id: string;
  circle_id: string;
  title: string;
  status: string;
  amount: number;
  timestamp: string;
}

const dropdownValue = [
  { label: 'Pending', value: 'pending' },
  { label: 'Fail', value: 'fail' },
  { label: 'Reject', value: 'reject' },
  { label: 'Success', value: 'success' }
];

const TransactionHistory = (): JSX.Element => {
  const width = useWindowInnerWidth();
  const [activeTab, setActiveTab] = useState('income');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [filterIncome] = useState(initialFilterIncome);
  const [filterOutcome, setFilterOutcome] = useState(initialFilterOutcome);
  const [balance, setBalance] = useState(0);
  const [transactionIn, setTransactionIn] = useState<Transaction[]>();
  const [transactionOut, setTransactionOut] = useState<Transaction[]>();
  const { t } = useTranslation();
  const data = [
    { label: `${t('circle.withdraw.history.tab1')}`, value: 'income' },
    { label: `${t('circle.withdraw.history.tab2')}`, value: 'outcome' }
  ];
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
  const handleSortBy = (event: any): void => {
    setFilterOutcome(prevState => ({
      ...prevState,
      status: event.target.value
    }));

    void fetchCircleTransactionOut();
  };

  const fetchCircleBalance = async (): Promise<void> => {
    try {
      setIsLoadingBalance(true);
      getCircleBalance()
        .then(res => {
          setBalance(res.data.balance);
          setIsLoadingBalance(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoadingBalance(false);
        });
    } catch (error: any) {
      setIsLoadingBalance(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  const fetchCircleTransactionIn = async (): Promise<void> => {
    try {
      setIsLoadingTransaction(true);
      getCircleTransactionIn(filterIncome)
        .then(res => {
          setTransactionIn(res.data);
          setIsLoadingTransaction(false);
        })
        .catch(err => {
          console.log(err);
          if (err.response.status === 404) {
            setTransactionIn([]);
          }
          setIsLoadingTransaction(false);
        });
    } catch (error: any) {
      setIsLoadingTransaction(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  const fetchCircleTransactionOut = async (): Promise<void> => {
    try {
      setIsLoadingTransaction(true);
      getCircleTransactionOut(filterOutcome)
        .then(res => {
          setTransactionOut(res.data);
          setIsLoadingTransaction(false);
        })
        .catch(err => {
          console.log(err);
          if (err.response.status === 404) {
            setTransactionOut([]);
          }
          setIsLoadingTransaction(false);
        });
    } catch (error: any) {
      setIsLoadingTransaction(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  useEffect(() => {
    void fetchCircleBalance();
    void fetchCircleTransactionIn();
  }, []);

  useEffect(() => {
    void fetchCircleTransactionOut();
  }, [filterOutcome.status]);

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
        <div className="mb-4">
          <h6 className="mb-4 text-center text-lg font-poppins font-semibold">
            Transaction History
          </h6>
        </div>
        <div className="flex items-center justify-center rounded-xl">
          <CCard className="p-9 border-none rounded-none shadow-none w-full bg-white md:mx-8 lg:mx-10 xl:mx-[10rem]">
            <Card className="bg-[#8a70e0] h-full rounded-none">
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
            <Tabs value={activeTab}>
              <TabsHeader
                className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                indicatorProps={{
                  className:
                    'bg-transparent border-b-2 border-[#3AC4A0] shadow-none rounded-none'
                }}
              >
                {data.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => {
                      setActiveTab(value);
                    }}
                    className={`${activeTab === value ? 'text-[#3AC4A0]' : ''}`}
                  >
                    <Typography className="text-base font-medium">
                      {label}
                    </Typography>
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody>
                {data.map(({ value }) => (
                  <TabPanel key={value} value={value}>
                    <div className="overflow-x-auto h-[35rem]" key={value}>
                      {value === 'income' ? (
                        <>
                          {!isLoadingTransaction ? (
                            transactionIn?.length !== 0 ? (
                              transactionIn?.map((data, idx) => (
                                <CardTransaction
                                  data={data}
                                  key={idx}
                                  userInfo={userInfo}
                                />
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
                        </>
                      ) : (
                        <>
                          <div className="flex items-end justify-end mb-4">
                            <label htmlFor="sort_by" className="text-xs">
                              Sort by:
                            </label>
                            <select
                              name="sort_by"
                              id="sort_by"
                              onChange={handleSortBy}
                              className="text-xs text-[#4DA81C]"
                            >
                              {dropdownValue?.map((data, idx) => (
                                <option key={idx} value={data.value}>
                                  {data.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {!isLoadingTransaction ? (
                            transactionOut?.length !== 0 ? (
                              transactionOut?.map((data, idx) => (
                                <>
                                  <CardTransaction
                                    data={data}
                                    userInfo={userInfo}
                                    key={idx}
                                  />
                                </>
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
                        </>
                      )}
                    </div>
                  </TabPanel>
                ))}
              </TabsBody>
            </Tabs>
          </CCard>
        </div>
      </CardGradient>
    </PageGradient>
  );
};

export default withAuth(TransactionHistory);
