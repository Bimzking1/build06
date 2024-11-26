/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable-next-line @typescript-eslint/restrict-plus-operands */
'use client';
import SubmitButton from '@/components/SubmitButton';
import Loading from '@/components/popup/Loading';
import Dialog from '@/components/ui/dialog/Dialog';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { bookEvent, getEventById } from '@/repository/discover.repository';
import { getPaymentList } from '@/repository/payment.repository';
import { getPaymentById } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type RootState } from '@/store/event';
import { selectPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { type EventList } from '@/utils/interfaces/event.interface';
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PaymentOptions from './PaymentOptions';
import VirtualAccountGuide from './VirtualAccountGuide';
import WalletForm from './WalletForm';

export interface UserData {
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phoneNumber: string;
  _pin: string;
  preferredCurrency: string;
}

export interface DetailTournament {
  id: string;
  admission_fee: number;
}
export interface Tournament {
  fee: number;
  admission_fee: number;
}

export interface Payment {
  id: string;
  payment_method: string;
  logo_url: string;
  payment_type: string;
  admin_fee: number;
  is_promo_available: boolean;
  promo_price: number;
  service_fee: number;
  payment_gateway?: string;
}

export interface PaymentStatus {
  orderId: string;
  transactionId: string;
  fraudStatus: string;
  transactionStatus: string;
  currency: string;
  merchantId: string;
  paymentGateway: string;
  itemName: string;
  itemId: string;
  quantity: number;
  grossAmount: number;
  paymentMethod: string;
  vaNumber: string;
  howToPayApi: string;
}

interface props {
  monthVal?: string;
}

const PaymentList: React.FC<props> = ({ monthVal }): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [ccList, setCcList] = useState([]);
  const [qRisList, setQRisList] = useState([]);
  const [virtualList, setVirtualList] = useState([]);
  const [option, setOption] = useState<Payment>();
  const [eWalletList, setEWalletList] = useState([]);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>();
  const [eventData, setEventData] = useState<EventList>();
  const useCoinsParam = router.query.useCoins;
  const useCoins = useCoinsParam === 'true';
  const { userName, userPhone, userEmail } = useSelector(
    (state: RootState) => state?.booking ?? {}
  );

  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  const userDefault = {
    name: '',
    seedsTag: '',
    email: '',
    pin: '',
    avatar: '',
    bio: '',
    birthDate: '',
    phoneNumber: '',
    _pin: '',
    preferredCurrency: ''
  };

  const defaultOption = {
    id: '',
    payment_method: '',
    logo_url: '',
    payment_type: '',
    admin_fee: 0,
    is_promo_available: false,
    promo_price: 0,
    service_fee: 0,
    payment_gateway: ''
  };

  const defaultEvent = {
    created_at: '',
    description: '',
    ended_at: '',
    event_date: '',
    event_price: 0,
    event_status: '',
    external_url: '',
    id: '',
    image_url: '',
    is_joined: false,
    is_liked: false,
    likes: 0,
    location_name: '',
    name: '',
    updated_at: ''
  };

  const fetchPaymentList = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getPaymentList(
        userInfo?.preferredCurrency?.toUpperCase()
      );
      setVirtualList(data.type_va);
      setQRisList(data.type_qris);
      setCcList(data.type_cc);
      setEWalletList(data.type_ewallet);
    } catch (error) {
      toast(`Error fetching Payment List: ${error as string}`);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async (): Promise<void> => {
    try {
      const response = await getUserInfo();
      setUserInfo(response);
    } catch (error) {
      toast(`ERROR fetch user info ${error as string}`);
    }
  };

  const numberMonth = (): number => {
    if (monthVal !== undefined && monthVal.length > 0) {
      return parseInt(monthVal.substring(0, 2));
    } else {
      return 1;
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  useEffect(() => {
    void fetchPaymentList();
  }, [userInfo?.preferredCurrency]);

  const fetchEventById = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await getEventById(id);
      setEventData(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEventById(id as string);
  }, [id]);

  const handlePay = async (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    totalAmount: number,
    phoneNumber: string | undefined = userInfo?.phoneNumber
  ): Promise<void> => {
    try {
      setLoading(true);
      if (
        type === 'ewallet' &&
        (phoneNumber === userInfo?.phoneNumber || phoneNumber === '')
      ) {
        toast.error('Please fill the phone number');
      }
      if (eventData) {
        const response = await bookEvent({
          event_id: eventData.id,
          payment_gateway: paymentGateway,
          payment_method: paymentMethod,
          name: userName,
          phone_number: userPhone,
          email: userEmail,
          promo_code: promoCodeValidationResult?.promo_code ?? '',
          is_use_coins: useCoins,
          succes_url: `${
            process.env.NEXT_PUBLIC_DOMAIN as string
          }/homepage/event/${id as string}`,
          cancel_url: `${
            process.env.NEXT_PUBLIC_DOMAIN as string
          }/homepage/event/${id as string}`
        });

        const resp = await getPaymentById(response.order_id);
        setPaymentStatus(resp);

        if (response) {
          if (response.payment_url !== '') {
            window.open(response.payment_url as string, '_blank');
          }
          await router
            .replace(
              `/homepage/event/${id as string}/payment/receipt/${
                response.order_id as string
              }`
            )
            .catch(error => {
              toast.error(error);
            });
        }
      }
    } catch (error) {
      toast.error(`${error as string}`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    let _admissionFee = 0;
    let _adminFee = 0;
    let _totalFee = 0;

    if (eventData) {
      _admissionFee = eventData?.event_price;
      _adminFee = 0;
      _totalFee = Number(_admissionFee) + Number(_adminFee);
    }

    if (option?.payment_type === 'qris') {
      void handlePay(option?.payment_type, 'MIDTRANS', 'OTHER_QRIS', _totalFee);
    } else if (option?.payment_type === 'cc') {
      void handlePay(option?.payment_type, 'STRIPE', 'CC', _totalFee);
    } else {
      setOpenDialog(true);
    }
  };

  const renderLoading = (): JSX.Element => <Loading />;

  const renderContent = (): JSX.Element => (
    <div className="relative md:bg-[url('/assets/vector/purple-ellipse.svg')] bg-[white] bg-opacity-30 bg-no-repeat bg-left-top w-full h-full flex flex-col items-center pt-8 md:p-8 rounded-xl">
      <Typography className="w-full max-w-[600px] text-left px-8 md:text-center text-neutral-500 text-lg font-semibold mb-3">
        {t('seedsEvent.payment.title')}
      </Typography>
      <div className="bg-[white] max-w-[600px] w-full h-full flex flex-col items-center p-8 rounded-xl">
        <PaymentOptions
          label="Virtual Account"
          options={virtualList}
          onChange={setOption}
          currentValue={option}
        />
        <PaymentOptions
          label="QRIS"
          options={qRisList}
          onChange={setOption}
          currentValue={option}
        />
        <PaymentOptions
          label={t('seedsEvent.payment.eWalletLabel')}
          options={eWalletList}
          onChange={setOption}
          currentValue={option}
        />
        <PaymentOptions
          label={t('PlayPayment.ccLabel')}
          options={ccList}
          onChange={setOption}
          currentValue={option}
        />
        <SubmitButton
          disabled={option?.id == null}
          fullWidth
          onClick={onSubmit}
        >
          {t('seedsEvent.payment.button')}
        </SubmitButton>
      </div>
    </div>
  );

  return (
    <PageGradient defaultGradient className="w-full md:px-20 my-10">
      {loading ? renderLoading() : renderContent()}
      <Dialog
        title={
          option?.payment_type === 'ewallet'
            ? t('seedsEvent.payment.WalletForm.title', {
                wallet: option.payment_method
              })
            : t('seedsEvent.payment.VirtualAccountGuide.title', {
                bank: option?.payment_method?.split('_')[0]
              })
        }
        isOpen={openDialog}
        bottomSheetOnSmall
        handleClose={() => {
          setOpenDialog(false);
        }}
      >
        {option?.payment_type === 'ewallet' ? (
          <WalletForm
            payment={option}
            handlePay={handlePay}
            numberMonth={numberMonth() > 0 ? numberMonth() : 1}
            dataPost={eventData ?? defaultEvent}
            userInfo={userInfo ?? userDefault}
          />
        ) : (
          <VirtualAccountGuide
            payment={option ?? defaultOption}
            handlePay={handlePay}
            numberMonth={numberMonth() > 0 ? numberMonth() : 1}
            dataPost={eventData ?? defaultEvent}
            paymentStatus={paymentStatus}
            user_name={userInfo?.name}
          />
        )}
      </Dialog>
    </PageGradient>
  );
};

export default PaymentList;
