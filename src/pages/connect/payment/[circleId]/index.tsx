import CirclePaymentLayout from '@/components/layouts/CirclePaymentLayout';
import Loading from '@/components/popup/Loading';
import TermConditionPage from '@/containers/circle/create-circle/termConditionPage';
import PaymentList from '@/containers/play/payment/PaymentList';
import withAuth from '@/helpers/withAuth';
import {
  getDetailCircle,
  getStatusCircle
} from '@/repository/circleDetail.repository';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ChooseSubs from './ChooseSubs';

const CirclePayment: React.FC = () => {
  const router = useRouter();
  const circleId: string | any = router.query.circleId;
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [pages, setPages] = useState<string>('chooseSubs');
  const [dataPost, setDataPost]: any = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDetailCircle = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const { data } = await getDetailCircle({ circleId });

      setDataPost(data);
    } catch (error) {
      toast.error(`Error fetching Circle Post: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUserInfo = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const { data } = await getStatusCircle({ circleId });
      const { status }: any = data;
      if (status === 'accepted') {
        router.push(`/connect`).catch(error => {
          toast.error(`${error as string}`);
        });
      }
    } catch (error) {
      toast.error(`Error fetching Circle Post: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    void fetchDetailCircle();
    void fetchUserInfo();
  }, [circleId]);

  const handlePages = (): any => {
    if (pages === 'chooseSubs') {
      return <ChooseSubs setPages={setPages} dataPost={dataPost} />;
    } else if (pages === 'terms') {
      return (
        <div className="flex justify-center ">
          <TermConditionPage
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            handleRoute={() => {
              if (isChecked) {
                setIsError(false);
                setPages('choosePayment');
              }
              setIsError(true);
            }}
          />
          {isError && (
            <h1 className="absolute bottom-[70px] font-poppins font-medium text-center text-red-400">
              Please accept our Terms and Condition
            </h1>
          )}
        </div>
      );
    }
  };
  return (
    <>
      {isLoading ? <Loading /> : <></>}
      {pages === 'choosePayment' ? (
        <PaymentList dataPost={dataPost} />
      ) : (
        <CirclePaymentLayout>
          <div className=" w-screen sm:w-full h-fit mb-10 rounded-xl">
            {handlePages()}
          </div>
        </CirclePaymentLayout>
      )}
    </>
  );
};

export default withAuth(CirclePayment);
