import BackgroundPayment from '@/assets/play/quiz/BackgroundPayment.svg';
import ChecklistPayment from '@/assets/play/quiz/ChecklistPayment.svg';
import RectangleStatusPayment from '@/assets/play/quiz/RectangleStatusPayment.svg';
import RectangleStatusPaymentTiny from '@/assets/play/quiz/RectangleStatusPaymentTiny.svg';
import withAuth from '@/helpers/withAuth';
import { getWithdrawalList } from '@/repository/payment.repository';
import { getQuizWithdraw } from '@/repository/quiz.repository';
import { Button, Card, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface PaymentDataI {
  id: string;
  rank: number;
  user_id: string;
  user_name: string;
  quiz_id: string;
  quiz_name: string;
  amount: number;
  fee_amount: number;
  method: string;
  account_name: string;
  account_number: string;
  status: string;
  created_at: string;
}

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

const StatusPayment: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const id = router.query.id;
  const [loading, setLoading] = useState(true);
  const [withdrawData, setWithdrawData] = useState<PaymentDataI>();
  const [bankList, setBankList] = useState<IAccountList[]>([]);
  const [eWalletList, setEWalletList] = useState<IAccountList[]>([]);

  const fetchWithdrawStatus = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await getQuizWithdraw(id as string);
      // response from BE is array, always take index 0 for latest data
      setWithdrawData(res?.data[0]);
    } catch (error: any) {
      toast(`Error fetching Withdraw Status: ${error.message as string}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentList = async (): Promise<void> => {
    try {
      const data = await getWithdrawalList();
      setBankList(data.type_va);
      setEWalletList(data.type_ewallet);
    } catch (error: any) {
      toast(`Error fetching Payment List: ${error.message as string}`);
    }
  };

  const getImageUrl = (type: string, name: string): string => {
    const paymentMethod = type === 'BANK' ? bankList : eWalletList;
    const formatedName = name.split(' ').reverse().join('_');
    const matchingPayment = paymentMethod.find(
      payment => payment.payment_method === formatedName
    );
    return matchingPayment != null ? matchingPayment.logo_url : '';
  };

  useEffect(() => {
    if (typeof id === 'string') {
      void fetchWithdrawStatus();
    }
    void fetchPaymentList();
  }, [id]);

  return (
    <Card shadow={false} className="w-full rounded-xl relative h-[816px]">
      <div className="flex flex-col items-center bg-[#3AC4A0] rounded-t-xl relative h-[384px]">
        <Image
          src={BackgroundPayment}
          alt="BackgroundPayment"
          className="absolute bottom-0"
        />
      </div>
      <div className="flex flex-col items-center absolute w-full">
        <div className="flex flex-col gap-2 w-[266px] z-10 items-center mt-14 mb-[34px]">
          <Image
            src={ChecklistPayment}
            alt="ChecklistPayment"
            className="w-[60px]"
          />
          <Typography className="font-poppins font-semibold text-2xl text-white text-center">
            {t('quiz.thankyou')}
          </Typography>
          <Typography className="font-poppins font-normal text-sm text-white text-center">
            {t('quiz.withdrawalRequest')}
          </Typography>
        </div>
        <div className="mb-[70px] relative flex justify-center">
          <div className="absolute flex flex-col items-center ">
            <div className="flex flex-col gap-3 mt-6 mb-11">
              <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                {t('quiz.paymentMethod')}
              </Typography>
              {!loading && (
                <Image
                  width={200}
                  height={100}
                  src={getImageUrl(
                    withdrawData?.method as string,
                    withdrawData?.account_name as string
                  )}
                  alt="BCABank"
                  className="w-[102px]"
                />
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className=" flex justify-between w-[295px]">
                <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                  {t('quiz.date')}
                </Typography>
                <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                  {moment(withdrawData?.created_at).format(
                    'DD-MM-YYYY hh:mm:ss'
                  )}
                </Typography>
              </div>
              <div className=" flex justify-between w-[295px]">
                <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                  {t('quiz.id')}
                </Typography>
                <Typography className="font-poppins text-right font-semibold text-sm text-[#262626]">
                  {withdrawData?.id}
                </Typography>
              </div>
              <div className=" flex justify-between w-[295px]">
                <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                  {t('quiz.withdraw')}
                </Typography>
                <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                  IDR {withdrawData?.amount.toLocaleString('id-ID')}
                </Typography>
              </div>
              <div className=" flex justify-between w-[295px]">
                <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                  {t('quiz.adminFee')}
                </Typography>
                <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                  IDR {withdrawData?.fee_amount.toLocaleString('id-ID')}
                </Typography>
              </div>
              <div className="border-b border-[#BDBDBD]"></div>
              <div className=" flex justify-between w-[295px]">
                <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                  {t('quiz.nominal')}
                </Typography>
                <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                  IDR{' '}
                  {withdrawData?.amount !== undefined &&
                  withdrawData?.fee_amount !== undefined
                    ? (
                        withdrawData.amount - withdrawData.fee_amount
                      ).toLocaleString('id-ID')
                    : ''}
                </Typography>
              </div>
            </div>
            <div className=" flex justify-between w-[295px] mt-[50px]">
              <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                {t('quiz.total')}
              </Typography>
              <Typography className="font-poppins font-semibold text-lg text-[#3AC4A0]">
                IDR{' '}
                {withdrawData?.amount !== undefined &&
                withdrawData?.fee_amount !== undefined
                  ? (
                      withdrawData.amount - withdrawData.fee_amount
                    ).toLocaleString('id-ID')
                  : ''}
              </Typography>
            </div>
          </div>

          <Image
            src={RectangleStatusPayment}
            alt="RectangleStatusPayment"
            className="hidden lg:flex"
          />
          <Image
            src={RectangleStatusPaymentTiny}
            alt="RectangleStatusPaymentTiny"
            className="lg:hidden flex"
          />
        </div>
        <Button
          onClick={() => {
            router
              .push(`/play/`)
              .then(() => {})
              .catch(() => {});
          }}
          className="w-[343px] bg-[#3AC4A0] rounded-full"
        >
          Ok
        </Button>
      </div>
    </Card>
  );
};

export default withAuth(StatusPayment);
