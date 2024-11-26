import ListPayment from '@/components/academy/ListPayment';
import Receipt from '@/components/academy/Receipt';
import SummaryPay from '@/components/academy/SummaryPay';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { enrollClass, getClassDetail } from '@/repository/academy.repository';
import { getHowToPay, getPaymentList } from '@/repository/payment.repository';
import { getPaymentById } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { getTransactionSummary } from '@/repository/seedscoin.repository';
import { selectPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import {
  type DetailClassI,
  type EnrollClassI,
  type PaymentList,
  type PaymentStatus,
  type PriceDataI
} from '@/utils/interfaces/academy.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Radio } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Payment: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [namePayment, setNamePayment] = useState('');
  const [eWalletList, setEWalletList] = useState([]);
  const [qRisList, setQRisList] = useState<PaymentList[]>([]);
  const [virtualList, setVirtualList] = useState<PaymentList[]>([]);
  const [detailClass, setDetailClass] = useState<DetailClassI | undefined>(
    undefined
  );
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const router = useRouter();
  const { id, coins } = router.query;
  const [formData, setFormData] = useState<EnrollClassI>({
    phone_number: '',
    payment_gateway: '',
    payment_method: '',
    is_use_coins: false
  });
  const [paymentGateway, setPaymentGateway] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [adminFee, setAdminFee] = useState<number>(0);
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [promoAvailable, setPromoAvailable] = useState<boolean>(false);
  const [promoPrice, setPromoPrice] = useState<number>(0);
  const [data, setData] = useState<PaymentStatus | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const dynamicPrice =
    detailClass?.price?.[
      userInfo?.preferredCurrency?.toLowerCase() as keyof PriceDataI
    ];
  const promoCodeValidation = useSelector(selectPromoCodeValidationResult);
  const [amountCoins, setAmountCoins] = useState<number>(0);
  const [classAfterPay, setClassAfterPay] = useState<DetailClassI | undefined>(
    undefined
  );
  const [steps, setSteps] = useState<string[]>([]);
  const [isListPaymentHidden, setIsListPaymentHidden] =
    useState<boolean>(false);

  const handleGetPayment = async (): Promise<void> => {
    try {
      if (id !== undefined) {
        const response = await getPaymentById(id as string);
        setData(response);
        if (response?.itemId !== '') {
          const responseClassAfterPay = await getClassDetail(
            response?.itemId as string
          );
          setClassAfterPay(responseClassAfterPay);
        }
        if (response?.howToPayApi !== undefined) {
          const responseHowToPay = await getHowToPay(response?.howToPayApi);
          setSteps(responseHowToPay?.payment_instruction[0]?.step);
        }
      }
    } catch (error: any) {
      // toast('Complete your payment!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (
    id: string,
    gateway: string,
    method: string,
    adminFee: number,
    serviceFee: number,
    promoAvailable: boolean,
    promoPrice: number
  ): void => {
    setSelectedPayment(id);
    setPaymentGateway(gateway);
    setPaymentMethod(method);
    setAdminFee(adminFee);
    setServiceFee(serviceFee);
    setPromoAvailable(promoAvailable);
    setPromoPrice(promoPrice);
  };

  const paymentSelectedEWallet: PaymentList[] = eWalletList?.filter(
    (el: undefined | PaymentList): any => {
      return el?.payment_method === data?.paymentMethod;
    }
  );
  const paymentSelectedVirtual: PaymentList[] = virtualList?.filter(
    (el: undefined | PaymentList): any => {
      return el?.payment_method === data?.paymentMethod;
    }
  );

  const handlePaymentList = async (): Promise<void> => {
    try {
      const payList = await getPaymentList(
        userInfo?.preferredCurrency?.toUpperCase()
      );
      setQRisList(payList.type_qris);
      setEWalletList(payList.type_ewallet);
      setVirtualList(payList.type_va);
      if (coins === 'true') {
        void handleGetCoins();
      }
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCoins = async (): Promise<void> => {
    try {
      const responseCoins = await getTransactionSummary();
      setAmountCoins(responseCoins?.data?.total_available_coins);
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  const handleGetClass = async (): Promise<void> => {
    try {
      if (id !== undefined) {
        const responseClass = await getClassDetail(id as string);
        setDetailClass(responseClass);
      }
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  const handleGetUserInfo = async (): Promise<void> => {
    try {
      const response = await getUserInfo();
      setUserInfo(response);
      setFormData({ phone_number: response?.phoneNumber });
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  const togglePopup = (): void => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    void handleGetUserInfo();
  }, []);

  useEffect(() => {
    void handlePaymentList();
    void handleGetPayment();
    void handleGetClass();
  }, [id]);

  useEffect(() => {
    setIsListPaymentHidden(detailClass?.id === undefined);
  }, [detailClass?.id]);

  const handlePayment = async (): Promise<void> => {
    if (selectedPayment === null) {
      toast('Select payment method!', { type: 'warning' });
      return;
    }

    try {
      const response = await enrollClass(id as string, {
        ...formData,
        payment_gateway: paymentGateway,
        payment_method: paymentMethod,
        promo_code: promoCodeValidation?.promo_code,
        is_use_coins: coins === 'true'
      });
      if (response?.order_id !== undefined) {
        const statusOrder = await getPaymentById(response?.order_id);
        void router.push(
          `/academy/course/${statusOrder?.orderId as string}/payment?coins=${
            coins as string
          }`,
          undefined,
          { shallow: true }
        );
      }
      if (response?.payment_url !== '') {
        window.open(response?.payment_url, '_blank');
      }
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (): Promise<void> => {
    await handlePayment();
    togglePopup();
  };

  const renderOptions = (
    list: Array<{
      id: string;
      payment_method: string;
      payment_gateway: string;
      logo_url: string;
      admin_fee: number;
      promo_price: number;
      service_fee: number;
      is_promo_available: boolean;
    }>,
    prefix: string
  ): JSX.Element[] => {
    return list.map(item => (
      <div
        key={item.id}
        className={`flex items-center mb-2 justify-between px-3 py-2 border border-[#E0E0E0] rounded-lg cursor-pointer ${
          selectedPayment === `${prefix}-${item.id}` ? 'bg-gray-200' : ''
        }`}
        onClick={() => {
          handleSelect(
            `${prefix}-${item.id}`,
            item.payment_gateway,
            item.payment_method,
            item.admin_fee,
            item.service_fee,
            item.is_promo_available,
            item.promo_price
          );
          setNamePayment(item.payment_method);
        }}
      >
        <Image
          src={item.logo_url}
          width={100}
          height={100}
          alt={`${item.payment_method} icon`}
          className="h-5 object-cover w-auto"
        />
        <Radio
          type="radio"
          id={`${prefix}-${item.id}`}
          name="payment"
          className="rounded-xl border"
          color="teal"
          checked={selectedPayment === `${prefix}-${item.id}`}
          onChange={() => {
            handleSelect(
              `${prefix}-${item.id}`,
              item.payment_gateway,
              item.payment_method,
              item.admin_fee,
              item.service_fee,
              item.is_promo_available,
              item.promo_price
            );
          }}
        />
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="my-4">
          <div className="animate-spinner w-14 h-14 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <PageGradient defaultGradient className="w-full">
      <ListPayment
        isHidden={isListPaymentHidden}
        virtualList={renderOptions(virtualList, 'va')}
        ewalletList={renderOptions(eWalletList, 'wallet')}
        qrisList={renderOptions(qRisList, 'other')}
        paymentIsSelected={selectedPayment === null}
        showPopUp={togglePopup}
      />
      <SummaryPay
        isOpen={showPopup}
        onClose={togglePopup}
        payment={namePayment}
        amount={dynamicPrice as number}
        adminFee={adminFee}
        onConfirm={handleConfirm}
        serviceFee={serviceFee}
        promoAvailable={promoAvailable}
        promoPrice={promoPrice}
        currency={userInfo?.preferredCurrency?.toUpperCase() as string}
        coins={amountCoins}
      />
      <Receipt
        isHidden={!isListPaymentHidden}
        amountClass={
          classAfterPay?.price?.[
            userInfo?.preferredCurrency?.toLowerCase() as keyof PriceDataI
          ] as number
        }
        amount={data?.grossAmount as number}
        adminFee={
          paymentSelectedEWallet[0]?.admin_fee !== undefined
            ? paymentSelectedEWallet[0]?.admin_fee
            : paymentSelectedVirtual[0]?.admin_fee !== undefined
            ? paymentSelectedVirtual[0]?.admin_fee
            : qRisList[0]?.admin_fee
        }
        serviceFee={
          paymentSelectedEWallet[0]?.service_fee !== undefined
            ? paymentSelectedEWallet[0]?.service_fee
            : paymentSelectedVirtual[0]?.service_fee !== undefined
            ? paymentSelectedVirtual[0]?.service_fee
            : qRisList[0]?.service_fee
        }
        logoURL={
          paymentSelectedEWallet[0]?.logo_url !== undefined
            ? paymentSelectedEWallet[0]?.logo_url
            : paymentSelectedVirtual[0]?.logo_url !== undefined
            ? paymentSelectedVirtual[0]?.logo_url
            : qRisList[0]?.logo_url
        }
        orderDetail={data?.transactionStatus as string}
        orderItem={data?.itemId as string}
        currency={userInfo?.preferredCurrency?.toUpperCase() as string}
        promoAvailable={
          paymentSelectedEWallet[0]?.is_promo_available !== undefined
            ? paymentSelectedEWallet[0]?.is_promo_available
            : paymentSelectedVirtual[0]?.is_promo_available !== undefined
            ? paymentSelectedVirtual[0]?.is_promo_available
            : qRisList[0]?.is_promo_available
        }
        promoPrice={
          paymentSelectedEWallet[0]?.promo_price !== undefined
            ? paymentSelectedEWallet[0]?.promo_price
            : paymentSelectedVirtual[0]?.promo_price !== undefined
            ? paymentSelectedVirtual[0]?.promo_price
            : qRisList[0]?.promo_price
        }
        vaNumber={data?.vaNumber as string}
        howPay={steps}
      />
    </PageGradient>
  );
};

export default withAuth(Payment);
