import TrackerEvent from '@/helpers/GTM';
import withRedirect from '@/helpers/withRedirect';
import {
  editVerifyOtp,
  getOtp,
  quickLogin,
  quickRegister,
  verifyOtp
} from '@/repository/auth.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { fetchExpData } from '@/store/redux/features/exp';
import { fetchUserData } from '@/store/redux/features/user';
import type { AppDispatch } from '@/store/redux/store';
import type { OTPDataI } from '@/utils/interfaces/otp.interface';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { NextRouter } from 'next/router';
import { AuthLocalStorage } from './authLocalStorage';

export const handleGetOTP = async (
  method: string,
  setCountdown: React.Dispatch<React.SetStateAction<number>>,
  setSelect: React.Dispatch<React.SetStateAction<number>>,
  formOTPData: OTPDataI
): Promise<void> => {
  const getOTP = {
    method,
    phoneNumber: formOTPData.phoneNumber
  };
  await getOtp(getOTP);
  setCountdown(60);
  setSelect(1);
};

export const handleOTP = async (
  otpForm: OTPDataI,
  guest: string | undefined,
  router: NextRouter,
  dispatch: AppDispatch,
  setSelect: React.Dispatch<React.SetStateAction<number>>,
  setOTPForm: React.Dispatch<React.SetStateAction<OTPDataI>>
): Promise<void> => {
  const isQuery = Object.keys(router.query).length > 0;

  // Data passing
  const verifyOTP = {
    method: otpForm.method,
    msisdn: otpForm.phoneNumber,
    otp: otpForm.otp
  };
  const guestLoginOTP = {
    phone_number: otpForm.phoneNumber,
    method: otpForm.method,
    otp: otpForm.otp
  };

  const guestRegistOTP = {
    phone_number: otpForm.phoneNumber,
    name: otpForm.name as string,
    method: otpForm.method,
    otp: otpForm.otp
  };

  // Additional logic
  const handleTracker = async (): Promise<void> => {
    await dispatch(fetchUserData());
    await dispatch(fetchExpData());
    const responseUser = await getUserInfo();
    TrackerEvent({
      event: 'SW_auth_login',
      userData: responseUser
    });
    if (isQuery) {
      await withRedirect(router, router.query);
    } else {
      await router.push('/homepage');
      TrackerEvent({
        event: `SW_homepage_page`,
        userData: responseUser
      });
    }
  };

  // Core logic after OTP
  if (localStorage.getItem('accessToken') !== null) {
    await editVerifyOtp(verifyOTP);
    if (window.location.pathname === '/auth/change-phone-number') {
      router.back();
    }
  } else if (guest === 'guest-login') {
    const response = await quickLogin(guestLoginOTP);
    AuthLocalStorage(response);
    await handleTracker();
  } else if (guest === 'guest-register') {
    const response = await quickRegister(guestRegistOTP);
    AuthLocalStorage(response);
    await handleTracker();
  } else if (guest === 'guest-normal-register') {
    const response = await quickLogin(guestLoginOTP);
    const { name } = jwt.decode(response.accessToken) as JwtPayload;
    setOTPForm({ ...otpForm, name, token: response.accessToken });
    setSelect(2);
  } else {
    await verifyOtp(verifyOTP);
    setSelect(2);
  }
};
