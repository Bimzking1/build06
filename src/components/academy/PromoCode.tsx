import { getPromocodeActive } from '@/repository/promo.repository';
// import { setPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import {
  type DetailClassI,
  // type PriceDataI,
  type PromoCodeI
} from '@/utils/interfaces/academy.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Radio } from '@material-tailwind/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

interface VoucherPromoProps {
  detailClass: DetailClassI;
  userInfo: UserInfo | undefined;
}

const VoucherPromo: React.FC<VoucherPromoProps> = ({
  detailClass,
  userInfo
}) => {
  const [showPromos, setShowPromos] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null);
  const [listPromo, setListPromo] = useState<PromoCodeI[] | undefined>(
    undefined
  );
  // const [promoCode, setPromoCode] = useState<string>('');
  // const dispatch = useDispatch();

  const handleGetActivePromo = async (): Promise<void> => {
    try {
      const response = await getPromocodeActive(1, 10);
      setListPromo(response?.data);
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  // const handleValidatePromo = async (): Promise<void> => {
  //   try {
  //     const response = await promoValidate({
  //       promo_code: promoCode,
  //       spot_type: 'Paid Academy',
  //       item_price:
  //         detailClass?.price?.[
  //           userInfo?.preferredCurrency?.toLowerCase() as keyof PriceDataI
  //         ],
  //       item_id: detailClass?.id,
  //       currency: userInfo?.preferredCurrency
  //     });
  //     if (response?.total_discount !== undefined) {
  //       dispatch(setPromoCodeValidationResult(response));
  //     } else {
  //       toast.error('Error Promo Code:', response?.message);
  //     }
  //   } catch (error: any) {
  //     dispatch(setPromoCodeValidationResult(''));
  //     toast(error.message, { type: 'error' });
  //   }
  // };

  const togglePromos = (): void => {
    setShowPromos(!showPromos);
  };

  const handleSelectPromo = (id: string, promoCode: string): void => {
    setSelectedPromo(id);
    // setPromoCode(promoCode);
  };

  useEffect(() => {
    void handleGetActivePromo();
  }, []);
  // useEffect(() => {
  //   if (selectedPromo !== null) {
  //     void handleValidatePromo();
  //   }
  // }, [selectedPromo]);

  return (
    <div className="relative">
      <div
        className="flex flex-row items-center justify-between p-2 rounded-xl bg-[#F0FFF4] border border-[#3AC4A0] cursor-pointer w-full"
        onClick={togglePromos}
      >
        <div className="flex flex-row items-center">
          <Image
            src={'/assets/academy/voucher-icon.svg'}
            alt="voucher-icon"
            width={100}
            height={100}
            className="w-10"
          />
          <span>Voucher & Promo</span>
        </div>
        <Image
          src={'/assets/academy/arrow-icon.svg'}
          alt="arrow-icon"
          width={100}
          height={100}
          className={`w-7 transition-transform ${
            showPromos ? 'rotate-90' : ''
          }`}
        />
      </div>

      {showPromos && (
        <div className="mt-1 w-full text-sm">
          {listPromo?.map(promo => (
            <div
              key={promo.id}
              className={`font-medium flex justify-between items-center border mb-1 ps-3 rounded-lg cursor-pointer ${
                selectedPromo === promo.id
                  ? 'bg-[#D1FAE5] border-[#3AC4A0]'
                  : 'border-[#b5e9db]'
              }`}
              onClick={() => {
                handleSelectPromo(promo.id, promo.promo_code);
              }}
            >
              {promo.promo_code}{' '}
              <Radio
                type="radio"
                className="rounded-xl border w-3 h-3"
                color="teal"
                checked={selectedPromo === promo.id}
                onChange={() => {
                  handleSelectPromo(promo.id, promo.promo_code);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoucherPromo;
