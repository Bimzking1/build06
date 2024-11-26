import PromoCode from '@/components/promocode/promoCode';
import Button from '@/components/ui/button/Button';
import { standartCurrency } from '@/helpers/currency';
import useWindowInnerHeight from '@/hooks/useWindowInnerHeight';
import { getUserInfo } from '@/repository/profile.repository';
import { type RootState } from '@/store/premium-circle';
import { setMonth, setPrice } from '@/store/premium-circle/premiumCircleSlice';
import { setPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';

import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { PaymentSVG } from 'public/assets/circle';
import VoucherInvalid from 'public/assets/vector/voucher-invalid.svg';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface props {
  dataPost: any;
  setPages: any;
}

const ChooseSubs: React.FC<props> = ({ dataPost, setPages }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const dispatch = useDispatch();
  const monthSubscription = ['1 month', '3 month', '6 month', '12 month'];
  const height = useWindowInnerHeight();
  const { premiumCircleMonth } = useSelector(
    (state: RootState) => state?.premiumCircle ?? {}
  );

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    dispatch(setPromoCodeValidationResult(0));
    dispatch(setMonth(value));
  };

  const handleSubmit = (event: any): void => {
    event.preventDefault();
    if (dataPost?.type !== 'lifetime' && premiumCircleMonth === '') {
      setPages('chooseSubs');
    }
    setPages('terms');
  };

  const numberMonth = (): number => {
    if (premiumCircleMonth !== undefined && premiumCircleMonth.length > 0) {
      dispatch(
        setPrice(
          dataPost?.premium_fee * parseInt(premiumCircleMonth.substring(0, 2))
        )
      );
      return parseInt(premiumCircleMonth.substring(0, 2));
    } else {
      dispatch(setPrice(dataPost?.premium_fee));
      return 1;
    }
  };

  return (
    <>
      <div className="flex justify-center pt-4">
        <h1 className="font-poppins font-semibold text-lg">Fee Membership</h1>
      </div>
      <div className="flex justify-center">
        <div className="flex justify-center absolute pl-4 pt-2">
          <Image src={PaymentSVG} alt="image" className="w-[230px] h-[230px]" />
        </div>
      </div>
      <div className="flex justify-center pt-[250px]">
        <h1 className="font-poppins max-w-[212px] font-semibold text-xl text-center">
          Get Access to unlock your membership
        </h1>
      </div>
      <div className="flex justify-center">
        <h1 className="font-poppins max-w-[340px] font-light text-sm text-center">
          Unlimited access to premium content from various experts.
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center pt-4">
          <div className="grid grid-cols-2 gap-4">
            {dataPost?.type === 'lifetime' ? (
              <></>
            ) : (
              monthSubscription.map((el, i) => (
                <label className="cursor-default" key={i}>
                  <input
                    type="radio"
                    className="peer sr-only"
                    name="type"
                    onChange={handleInputChange}
                    value={el}
                  />
                  <div
                    className={`w-[150px] z-50 rounded-full ring-1 p-2 ${
                      el !== premiumCircleMonth
                        ? 'text-black cursor-pointer bg-white hover:text-white ring-neutral-soft transition-all hover:shadow  hover:ring-white hover:bg-neutral-soft hover:ring-offset-1'
                        : 'text-white cursor-not-allowed ring-white bg-seeds-green ring-offset-1'
                    }`}
                  >
                    <div className="flex gap-2">
                      <div className="flex justify-center w-full gap-5 ">
                        <div className="flex flex-col justify-start">
                          <p className="text-sm font-light font-poppins">
                            {el}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[350px] mt-2 rounded-2xl border border-seeds-purple">
            <div className="bg-seeds-purple w-full p-2 rounded-t-xl pl-2 text-white">
              <h1 className="font-poppins text-xs font-medium">
                {dataPost?.type === 'lifetime'
                  ? 'Lifetime Access'
                  : 'Subscription'}
              </h1>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col pb-2">
                <h1 className="pt-4 text-center font-poppins text-base font-semibold">
                  {userInfo?.preferredCurrency}{' '}
                  {standartCurrency((dataPost?.premium_fee ?? 0) * numberMonth())}
                </h1>
                <h1 className="pt-2 text-center font-poppins text-base font-light">
                  Get full access according to your subscription time
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="w-full flex justify-center items-center mt-6">
          {dataPost?.type === 'subscription' && premiumCircleMonth === '' ? (
            <div className="w-full max-w-[350px] px-4">
              <div className="border-[#BDBDBD] bg-white flex justify-start items-center border rounded-lg py-2 px-4 gap-2">
                <div className="w-[30px] h-[30px] flex justify-center items-center">
                  <Image
                    src={VoucherInvalid}
                    alt="Voucher"
                    width={100}
                    height={100}
                    className="object-contain h-full w-full"
                  />
                </div>
                <Typography className="text-[#BDBDBD] font-poppins flex justify-center items-center font-semibold">
                  Voucher & Promo
                </Typography>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[350px] px-4">
              {userInfo !== undefined && (dataPost?.premium_fee ?? 0) > 0 && (
                <PromoCode
                  userInfo={userInfo}
                  id={dataPost?.id as string}
                  spotType={'Premium Circle'}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            props={{
              type: 'submit'
            }}
            className={`w-[350px] rounded-full py-3 px-6 font-poppins font-semibold leading-4 ${
              dataPost?.type !== 'lifetime' && premiumCircleMonth === ''
                ? 'bg-neutral-soft text-neutral-medium shadow-neutral-soft/20 hover:shadow-neutral-soft/40 shadow-md hover:shadow-lg'
                : 'bg-seeds-button-green text-white shadow-seeds-green/20 hover:shadow-seeds-green/40 focus:outline-seeds-button-green shadow-md hover:shadow-lg'
            } ${
              height !== undefined && height < 760 ? 'text-xs' : 'text-sm'
            }transition-all duration-300 active:opacity-80 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
            label={'Next'}
          />
        </div>
      </form>
    </>
  );
};
export default ChooseSubs;
