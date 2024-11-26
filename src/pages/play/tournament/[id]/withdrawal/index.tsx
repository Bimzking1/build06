/* eslint-disable @typescript-eslint/explicit-function-return-type */
import ValidatePin from '@/components/forms/ValidatePin';
import Loading from '@/components/popup/Loading';
import IndexWithdrawal from '@/components/quiz/Withdrawal';
import { useGetDetailTournament } from '@/helpers/useGetDetailTournament';
import withRedirect from '@/helpers/withRedirect';
import useQuizCashout from '@/hooks/useCashoutQuiz';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export interface IWithdrawalAccount {
  method: string;
  account_name: string;
  account_number: string;
  beneficiary_name: string;
}

const Withdrawal: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  useGetDetailTournament(id as string);
  const [select, setSelect] = useState(0);
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<IWithdrawalAccount>();
  const emptyPinIndex = pin.findIndex(number => number === '');
  const joinPin = pin.join('');
  const quizId = router.query.id;
  const { submitLoading, submitQuizCashout } = useQuizCashout();
  const currentUnixTime = Math.floor(Date.now() / 1000);
  const expiredUnixTime = parseInt(
    window.localStorage.getItem('expiresAt') as string
  );

  const redirect = async (): Promise<void> => {
    if (
      window.localStorage.getItem('accessToken') === null ||
      expiredUnixTime < currentUnixTime
    ) {
      await withRedirect(router, { wti: quizId }, '/auth');
      toast.error(t('landingPageV2.redirectError'));
    }
  };

  useEffect(() => {
    void redirect();
  }, [quizId]);

  const handleSubmit = async () => {
    const res = await submitQuizCashout({
      quiz_id: quizId as string,
      method: selectedAccount?.method as string,
      account_name: selectedAccount?.account_name as string,
      account_number: selectedAccount?.account_number as string,
      beneficiary_name: selectedAccount?.beneficiary_name as string
    });
    if (res?.id != null) {
      const params = {
        adminFee: res.admin_fee,
        withdraw: res.raw_amount,
        serviceFee: res.service_fee,
        promoPrice: res.promo_price,
        date: res.created_at,
        ref: res.reference_number,
        id: quizId
      };
      router
        .push({
          pathname: `/withdrawal/payment-detail`,
          query: params
        })
        .then(() => {})
        .catch(() => {});
    }
  };

  if (joinPin !== '' && emptyPinIndex === -1) {
    setPin(['', '', '', '', '', '']);
    void handleSubmit();
  }

  const renderLoading = (): JSX.Element => <Loading />;
  const renderContent = (): JSX.Element => (
    <>
      <IndexWithdrawal
        setSelect={setSelect}
        className={select === 0 ? 'flex' : 'hidden'}
        setSelectedAccount={setSelectedAccount}
        account={selectedAccount}
      />
      <ValidatePin
        pin={pin}
        setPin={setPin}
        emptyPinIndex={emptyPinIndex}
        error={error}
        setError={setError}
        className={select === 1 ? 'flex' : 'hidden'}
        title="Enter Your PIN"
        setSelect={setSelect}
      />
    </>
  );
  return <>{submitLoading ? renderLoading() : renderContent()}</>;
};

export default Withdrawal;
