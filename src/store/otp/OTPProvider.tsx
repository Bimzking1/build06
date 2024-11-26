import { useRouter } from 'next/router';
import {
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from 'react';
import { useTranslation } from 'react-i18next';

// import ErrorBEContext from '../error-be/error-be-context';
import LoadingContext from '../loading/loading-context';
import SuccessContext from '../success/success-context';
import OTPContext from './otp-context';

interface OTPProviderProps {
  children: ReactNode;
}

interface PayloadType {
  otp: string;
  action: string;
}

const OTPProvider: React.FC<OTPProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const router = useRouter();
  //   const errorBECtx = useContext(ErrorBEContext);
  const loadingCtx = useContext(LoadingContext);
  const successCtx = useContext(SuccessContext);

  const [otp, setOtp] = useState('');

  const resetHandler = (): void => {
    setOtp('');
  };

  const changeTargetHandler = async (payload: string): Promise<void> => {
    try {
      await router.push({
        pathname: '/send-otp-code',
        query: { target: payload }
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const continueHandler = async (
    payload: PayloadType,
    setFirst: Dispatch<SetStateAction<string>>,
    setSecond: Dispatch<SetStateAction<string>>,
    setThird: Dispatch<SetStateAction<string>>,
    setFourth: Dispatch<SetStateAction<string>>
  ): Promise<void> => {
    loadingCtx.loadingHandler(true);
    try {
      // API...

      // todo: nanti reset dan open success kalau berhasil aja, pindahin setelah setTimeout!
      setTimeout(() => {
        loadingCtx.loadingHandler(false);
        setFirst('');
        setSecond('');
        setThird('');
        setFourth('');
        successCtx.onOpen({
          title: t('successPopup.title.general'),
          subtitle: t(`successPopup.subtitle.${payload.action}`)
        });
      }, 800);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const otpContext = {
    otp,
    changeOtpTarget: changeTargetHandler,
    onContinue: continueHandler,
    resetOtp: resetHandler
  };

  return (
    <OTPContext.Provider value={otpContext}>{children}</OTPContext.Provider>
  );
};

export default OTPProvider;
