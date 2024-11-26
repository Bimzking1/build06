import BackgroundPayment from '@/assets/play/quiz/BackgroundPayment.svg';
import BlueInformation from '@/assets/play/quiz/BlueInformation.svg';
import ChecklistPayment from '@/assets/play/quiz/ChecklistPayment.svg';
import PaymentRectangle from '@/assets/play/quiz/PaymentRectangle.svg';
import PaymentRectangleTiny from '@/assets/play/quiz/PaymentRectangleTiny.svg';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
interface PaymentDetailProps {
  id: string;
  date: string;
  refNumber: string;
  withdraw: number;
  adminFee: number;
  promoPrice: number;
  serviceFee: number;
}
const PaymentDetail: React.FC<PaymentDetailProps> = ({
  id,
  date,
  refNumber,
  withdraw,
  adminFee,
  promoPrice,
  serviceFee
}: PaymentDetailProps) => {
  const { t } = useTranslation();
  return (
    <Card shadow={false} className="w-full rounded-xl">
      <div className="flex flex-col items-center justify-end bg-[#3AC4A0] rounded-t-xl relative h-[298px]">
        <div className="absolute flex flex-col gap-2 w-[266px] z-10 items-center mb-3 ">
          <Image src={ChecklistPayment} alt="ChecklistPayment" />
          <Typography className="font-poppins font-semibold text-2xl text-white text-center">
            {t('quiz.thankyou')}
          </Typography>
          <Typography className="font-poppins font-normal text-sm text-white text-center">
            {t('quiz.withdrawalRequest')}
          </Typography>
        </div>

        <Image src={BackgroundPayment} alt="BackgroundPayment" />
      </div>

      <div className="flex flex-col p-4 gap-4">
        <Typography className="font-poppins font-semibold text-base text-[#3AC4A0]">
          {t('quiz.transactionDetails')}
        </Typography>
        <div className="flex relative justify-center">
          <div className="absolute flex flex-col gap-6 2xl:w-full sm:w-[490px] w-[350px] px-6 pt-[34px]">
            <div className="flex justify-between">
              <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                {t('quiz.date')}
              </Typography>
              <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                {date}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                {t('quiz.refNum')}
              </Typography>
              <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                {refNumber}
              </Typography>
            </div>
          </div>
          <div className="absolute 2xl:top-[160px] sm:top-52 top-[160px]  flex flex-col gap-4 2xl:w-full sm:w-[490px] w-[350px] px-16 pb-[26.52px]">
            <div className="flex justify-between">
              <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                {t('quiz.withdraw')}
              </Typography>
              <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                {`IDR ${withdraw}`}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                {t('quiz.adminFee')}
              </Typography>
              <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                {`IDR ${adminFee}`}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                {t('quiz.adminFeeDiscount')}
              </Typography>
              <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                {`IDR ${promoPrice}`}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                {t('quiz.serviceFee')}
              </Typography>
              <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                {`IDR ${serviceFee}`}
              </Typography>
            </div>
            <div className="border border-[#BDBDBD] w-full"></div>
            <div className="flex justify-between">
              <Typography className="font-poppins font-semibold text-sm text-[#BDBDBD]">
                {t('quiz.totalAmount')}
              </Typography>
              <Typography className="font-poppins font-semibold text-sm text-[#262626]">
                {`IDR ${withdraw - adminFee - serviceFee + promoPrice}`}
              </Typography>
            </div>
          </div>
          <Image
            src={PaymentRectangle}
            alt="PaymentRectangle"
            className="w-full hidden 2xl:flex"
          />
          <Image
            src={PaymentRectangleTiny}
            alt="PaymentRectangleTiny"
            className="w-[343px] sm:w-[500px] 2xl:hidden flex"
          />
        </div>
        <div className="flex gap-3">
          <Image src={BlueInformation} alt="BlueInformation" />
          <Typography className="font-poppins font-light text-sm text-[#5263F9]">
            The withdrawal request would take one business day.
          </Typography>
        </div>
        <Link href={`payment-detail/status?id=${id}`} className="self-center">
          <Button className="font-poppins font-semibold text-sm text-white w-[343px] rounded-full capitalize bg-[#3AC4A0] mt-2">
            Check Status
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default PaymentDetail;
