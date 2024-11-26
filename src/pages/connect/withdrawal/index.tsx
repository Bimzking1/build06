import FinalModalCircle from '@/components/circle/FinalModalCircle';
import InputPin from '@/components/forms/InputPin';
import { errorCircle } from '@/constants/assets/icons';
import SuccessPage from '@/containers/circle/withdraw/SuccessPage';
import WithdrawCircle from '@/containers/circle/withdraw/WithdrawCircle';
import WithdrawMethod from '@/containers/circle/withdraw/WithdrawMethod';
import withAuth from '@/helpers/withAuth';
import {
  getCircleBalance,
  withdrawCircle
} from '@/repository/circle.repository';
import { useEffect, useState } from 'react';

interface FormRequest {
  method: string;
  account_name: string;
  account_number: string;
  amount: any;
  pin: any;
}

interface RequiredForm {
  nominal: string;
  method: string;
  bankAccount: string;
  accountNumber: string;
  accountName: string;
}

interface DataResponse {
  image: string;
  amount: number;
  adminAmount: number;
  id: string;
  reference_number: string;
  created_at: any;
}

const initialDataResponse = {
  image: '',
  amount: 0,
  adminAmount: 0,
  id: '',
  reference_number: '',
  created_at: ''
};

const initialFormRequest = {
  method: '',
  account_name: '',
  account_number: '',
  amount: '',
  pin: []
};

const initialRequiredForm = {
  nominal: '',
  method: '',
  bankAccount: '',
  accountNumber: '',
  accountName: ''
};

const Withdrawal = (): JSX.Element => {
  const [step, setStep] = useState('');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balance, setBalance] = useState(0);
  const [errorPin, setErrorPin] = useState<string>('');
  const [formRequest, setFormRequest] =
    useState<FormRequest>(initialFormRequest);
  const [requiredForm, setRequiredForm] =
    useState<RequiredForm>(initialRequiredForm);
  const [image, setImage] = useState<string>('');
  const [dataSuccess, setDataSuccess] =
    useState<DataResponse>(initialDataResponse);

  const handleChangeValueRequired = (name: string, value: string): void => {
    setRequiredForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChangeStep = (value: string): void => {
    if (value === 'method') {
      if (formRequest.amount === '') {
        handleChangeValueRequired('nominal', 'Please input withdraw nominal');
      } else {
        setStep(value);
      }
    } else if (value === 'pin') {
      if (formRequest.method === '') {
        handleChangeValueRequired('method', 'Please input method withdraw');
      } else {
        handleChangeValueRequired('method', '');
      }

      if (formRequest.account_name === '') {
        handleChangeValueRequired(
          'bankAccount',
          'Please input Bank Account Type'
        );
      } else {
        handleChangeValueRequired('bankAccount', '');
      }

      if (formRequest.account_number === '') {
        handleChangeValueRequired(
          'accountNumber',
          'Please input Bank account number'
        );
      } else {
        handleChangeValueRequired('accountNumber', '');
      }

      if (
        formRequest.method !== '' &&
        formRequest.account_name !== '' &&
        formRequest.account_number !== ''
      ) {
        setStep(value);
      }
    } else {
      setStep(value);
    }
  };

  const handleChangeValue = (event: any): void => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFormRequest(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChangeValueMethod = (value: any): void => {
    setFormRequest(prevState => ({
      ...prevState,
      method: value
    }));
  };

  const handleChangeValueAccountName = (value: any): void => {
    setImage(value.logo_url);

    setFormRequest(prevState => ({
      ...prevState,
      account_name: value
    }));

    handleChangeValueRequired('bankAccount', '');
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

  const handleValuePin = (value: string): void => {
    setFormRequest(prevState => ({
      ...prevState,
      pin: [...prevState.pin, value]
    }));
  };

  const handleRemovePin = (): void => {
    setFormRequest(prevState => ({
      ...prevState,
      pin: prevState.pin.slice(0, formRequest.pin.length - 1)
    }));
  };

  const handleSubmit = async (): Promise<any> => {
    try {
      formRequest.pin = formRequest.pin.join('');
      formRequest.amount = parseInt(formRequest.amount);

      withdrawCircle(formRequest)
        .then(res => {
          if (res.status !== 200) {
            if (res.data.message === 'invalid PIN') {
              setErrorPin(
                'Please make sure you have the right PIN and try again.'
              );
              setFormRequest(prevstate => ({
                ...prevstate,
                pin: []
              }));
            } else {
              handleChangeStep('failed');
            }
          } else {
            setDataSuccess(res.data);
            setDataSuccess(prevData => ({
              ...prevData,
              image: image
            }));
            handleChangeStep('success');
          }
        })
        .catch(err => {
          console.log(err);
          handleChangeStep('failed');
        });
    } catch (error: any) {
      console.error('Error fetching circle data:', error.message);
    }
  };

  useEffect(() => {
    void fetchCircleBalance();

    if (formRequest.pin.length === 6) {
      void handleSubmit();
    }
  }, [formRequest.pin]);

  return (
    <>
      {step === 'pin' ? (
        <InputPin
          formRequest={formRequest}
          enterPinHandler={handleValuePin}
          onCancel={handleChangeStep}
          deletePinHandler={handleRemovePin}
          title="Enter Your PIN"
          subtitle="Please enter your PIN correctly"
          error={errorPin}
          isInputPin={false}
        />
      ) : step === 'method' ? (
        <WithdrawMethod
          changeStep={handleChangeStep}
          balance={balance}
          isLoadingBalance={isLoadingBalance}
          formRequest={formRequest}
          changeValueMethod={handleChangeValueMethod}
          changeValueAccountName={handleChangeValueAccountName}
          changeValue={handleChangeValue}
          formRequired={requiredForm}
        />
      ) : step === 'failed' ? (
        <FinalModalCircle
          button="Continue"
          title="Oops!"
          subtitle="Something went wrong, please try again later."
          imageUrl={errorCircle.src}
          handleOpen={handleSubmit}
          error={true}
        />
      ) : step === 'success' ? (
        <SuccessPage data={dataSuccess} />
      ) : (
        <WithdrawCircle
          changeStep={handleChangeStep}
          isLoadingBalance={isLoadingBalance}
          balance={balance}
          formRequest={formRequest}
          changeValue={handleChangeValue}
          requiredForm={requiredForm}
        />
      )}
    </>
  );
};

export default withAuth(Withdrawal);
