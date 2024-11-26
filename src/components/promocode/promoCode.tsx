import { standartCurrency } from '@/helpers/currency';
import { isGuest } from '@/helpers/guest';
import {
  selectPromoCodeValidationResult,
  setPromoCodeValidationResult
} from '@/store/redux/features/promo-code';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Switch, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import VoucherInvalid from '../../../public/assets/vector/voucher-invalid.svg';
import Voucher from '../../../public/assets/vector/voucher.svg';

interface PromoProps {
  userInfo: UserInfo;
  id: string;
  spotType: string;
  useCoins?: boolean;
}

const PromoCodeButton: React.FC<PromoProps> = ({
  userInfo,
  id,
  spotType,
  useCoins
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [usePromo, setUsePromo] = useState<boolean>(false);

  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  useEffect(() => {
    if (
      promoCodeValidationResult !== undefined &&
      promoCodeValidationResult !== 0
    ) {
      setUsePromo(true);
    } else {
      setUsePromo(false);
    }
  }, []);

  const routeOptions = (spotType: string, id: string): string => {
    if (spotType === 'Paid Tournament') {
      return `/play/tournament/${id}/promo`;
    } else if (spotType === 'Paid Quiz') {
      return `/play/quiz/${id}/promo`;
    } else if (spotType === 'Premium Circle') {
      return `/connect/payment/${id}/promo`;
    } else if (spotType === 'Premium Content') {
      return `/social/payment/${id}/promo`;
    }
    return '';
  };

  return (
    <>
      <div
        onClick={async () => {
          if (localStorage.getItem('accessToken') === null || isGuest()) {
            await router.push('/auth/verification');
          } else {
            if (!(useCoins ?? false)) {
              await router.push(routeOptions(spotType, id));
            }
          }
        }}
        className={`${
          useCoins ?? false
            ? 'border-[#BDBDBD] bg-white'
            : 'border-[#3AC4A0] bg-[#F0FFF4] hover:bg-[#d3ffdf] cursor-pointer hover:shadow-md duration-300'
        } flex justify-start items-center border rounded-lg py-2 px-4 gap-2`}
      >
        <div className="w-[30px] h-[30px] flex justify-center items-center">
          <Image
            src={useCoins ?? false ? VoucherInvalid : Voucher}
            alt="Voucher"
            width={100}
            height={100}
            className="object-contain h-full w-full"
          />
        </div>
        <Typography
          className={`${
            useCoins ?? false ? 'text-[#BDBDBD]' : 'text-[#27A590]'
          } font-poppins flex justify-center items-center font-semibold`}
        >
          Voucher & Promo
        </Typography>
      </div>
      {promoCodeValidationResult !== undefined &&
        promoCodeValidationResult !== 0 && (
          <div className="flex gap-2 justify-between items-center mt-2">
            <Typography className="w-full font-poppins text-sm text-[#27A590] font-semibold">
              {t(`promo.totalDiscount`)} {userInfo?.preferredCurrency ?? 'IDR'}
              {`${standartCurrency(
                promoCodeValidationResult?.response?.total_discount ?? 0
              ).replace('Rp', '')}`}
            </Typography>

            <div className="flex justify-center items-center">
              <Switch
                className="checked:bg-[#3AC4A0]"
                checked={usePromo}
                onChange={() => {
                  toast.success(t(`promo.unApplied`));
                  setUsePromo(false);
                  setTimeout(() => {
                    dispatch(setPromoCodeValidationResult(0));
                  }, 500);
                }}
              />
            </div>
          </div>
        )}
    </>
  );
};

export default PromoCodeButton;
