'use-client';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { CeklisCircle } from '@/constants/assets/icons';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface props {
  data: Data;
}

interface Data {
  image: string;
  amount: number;
  adminAmount: number;
  id: string;
  reference_number: string;
  created_at: any;
}

const SuccessPage: React.FC<props> = ({ data }) => {
  const { t } = useTranslation();
  const width = useWindowInnerWidth();
  const router = useRouter();
  const date = new Date(data.created_at);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;

  return (
    <PageGradient
      defaultGradient
      className="relative overflow-hidden flex flex-col items-center sm:p-0 sm:pb-16 w-full"
    >
      <CardGradient
        defaultGradient
        className={`relative overflow-hidden w-full sm:rounded-[18px] sm:min-h-[36rem] bg-white sm:px-20 py-8 ${
          width !== undefined && width < 370
            ? 'min-h-[38rem]'
            : width !== undefined && width < 400
            ? 'min-h-[45rem]'
            : width !== undefined && width < 415
            ? 'min-h-[48rem]'
            : ''
        } bg-white`}
      >
        <div className="flex items-center justify-center rounded-xl">
          <Card
            className="p-9 border-none rounded-xl shadow-none w-full md:w-2/3 xl:w-1/2 h-[50rem]"
            style={{
              background: 'linear-gradient(to bottom, #3AC4A0 50%, #FFFFFF 50%)'
            }}
          >
            <div className="flex items-center justify-center mb-9 mt-3">
              <Image
                src={CeklisCircle.src}
                alt="AVATAR"
                width={80}
                height={80}
              />
            </div>
            <Typography className="text-2xl font-semibold text-white text-center">
              Successful
            </Typography>
            <Typography className="text-sm font-normal text-white text-center">
              Your request has been made!
            </Typography>

            <Card className="p-5 mt-8 bg-white">
              <Typography className="text-sm font-semibold text-[#BDBDBD] text-center">
                Payment Method
              </Typography>
              <div className="flex items-center justify-center mb-9 mt-3">
                <Image src={data.image} alt="AVATAR" width={90} height={90} />
              </div>
              <hr className="border-t-2 border-dashed" />
              <div className="flex flex-row justify-between my-5">
                <Typography className="text-sm font-semibold text-[#BDBDBD]">
                  Withdraw
                </Typography>
                <Typography className="text-sm font-semibold text-[#262626]">
                  IDR {new Intl.NumberFormat().format(data.amount)}
                </Typography>
              </div>
              <div className="flex flex-row justify-between mb-5">
                <Typography className="text-sm font-semibold text-[#BDBDBD]">
                  Admin
                </Typography>
                <Typography className="text-sm font-semibold text-[#262626]">
                  {t('quiz.free')}
                </Typography>
              </div>
              <hr />
              <div className="flex flex-row justify-between my-5">
                <Typography className="text-sm font-semibold text-[#BDBDBD]">
                  Total Amount
                </Typography>
                <Typography className="text-sm font-semibold text-[#262626]">
                  IDR {new Intl.NumberFormat().format(data.amount)}
                </Typography>
              </div>
              <div className="flex flex-row justify-between mb-5">
                <Typography className="text-sm font-semibold text-[#BDBDBD]">
                  ID Transaction
                </Typography>
                <Typography className="text-sm font-semibold text-[#262626]">
                  {data.id}
                </Typography>
              </div>
              <div className="flex justify-center">
                <Typography className="text-[10px] mr-5 font-normal text-[#BDBDBD] text-center">
                  {formattedDate}
                </Typography>
                <Typography className="text-[10px] font-normal text-[#BDBDBD] text-center">
                  No.Ref {data.reference_number}
                </Typography>
              </div>
              {/* <Typography className="text-[10px] font-normal text-[#BDBDBD] text-center">
                {formattedDate} No.Ref {data.reference_number}
              </Typography> */}
            </Card>
            <Typography className="text-sm font-light text-[#5263F9] mt-5 flex flex-row">
              <InformationCircleIcon className="w-7 h-7 text-[#5263F9] mr-2" />
              The withdrawal request would take one business day.
            </Typography>

            <div className="w-full flex items-center justify-center">
              <Button
                className="w-full text-sm font-semibold bg-seeds-button-green mt-10 rounded-full capitalize"
                onClick={() => {
                  void router.push('/connect/transaction-history');
                }}
              >
                Transaction History
              </Button>
            </div>
          </Card>
        </div>
      </CardGradient>
    </PageGradient>
  );
};

export default SuccessPage;
