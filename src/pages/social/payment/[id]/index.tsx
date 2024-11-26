import PageGradient from '@/components/ui/page-gradient/PageGradient';
import FeeMembership from '@/containers/social/payment/FeeMembership';
import PaymentMethod from '@/containers/social/payment/PaymentMethod';
import TnC from '@/containers/social/payment/TnC';
import withAuth from '@/helpers/withAuth';
import { getUserInfo } from '@/repository/profile.repository';
import { getDetailPostSocial } from '@/repository/social.respository';
import {
  selectPromoCodeValidationResult,
  setPromoCodeValidationResult
} from '@/store/redux/features/promo-code';
import { type DataPost } from '@/utils/interfaces/social.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PaymentContent: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const [step, setStep] = useState<string>('fee');
  const [data, setData] = useState<DataPost>();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  const fetchDetailAsset = async (): Promise<void> => {
    try {
      if (typeof id === 'string') {
        const response = await getDetailPostSocial(id);
        setData(response.data);
      }
    } catch (error) {
      toast.error(`${error as string}`);
    }
  };

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});

    if (promoCodeValidationResult?.id !== id) {
      dispatch(setPromoCodeValidationResult(0));
    }
  }, []);

  useEffect(() => {
    if (id !== null) {
      void fetchDetailAsset();
    }
  }, [id]);

  return (
    <PageGradient defaultGradient className="w-full">
      {step === 'fee' ? (
        userInfo !== undefined &&
        data !== undefined && (
          <FeeMembership
            setStep={setStep}
            detailPost={data}
            userInfo={userInfo}
          />
        )
      ) : step === 'tnc' ? (
        <div className="lg:mx-20">
          <TnC
            stepBack={() => {
              setStep('fee');
            }}
            stepNext={() => {
              setStep('payment');
            }}
          />
        </div>
      ) : step === 'payment' ? (
        <>{data !== undefined && <PaymentMethod data={data} />}</>
      ) : null}
    </PageGradient>
  );
};

export default withAuth(PaymentContent);
