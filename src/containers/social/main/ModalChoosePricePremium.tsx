import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { PremiumContent } from 'public/assets/circle';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface props {
  isOpen: boolean;
  setIsOpen: any;
  changeForm: any;
  form: any;
}

const ModalChoosePricePremium: React.FC<props> = ({
  isOpen,
  setIsOpen,
  changeForm,
  form
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log(form.premium_fee);
    if (form.premium_fee < 2000) {
      setError('Minimum Fee is 2.000');
    } else {
      setError('');
    }
  }, [form.premium_fee]);

  return (
    <Dialog
      open={isOpen}
      handler={() => {}}
      className="overflow-y-scroll"
      size="sm"
    >
      <DialogHeader className="flex justify-between items-center p-2 sm:p-4">
        <p></p>
        <XMarkIcon
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(false);
          }}
          width={30}
          height={30}
        />
      </DialogHeader>
      <DialogBody className="p-4">
        <div className="flex justify-center">
          <h1 className="font-poppins font-semibold text-black text-xl text-center">
            Set Fee Premium Content
          </h1>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center pl-4 pt-2">
            <Image
              src={PremiumContent}
              alt="image"
              className="w-[200px] h-[200px]"
            />
          </div>
        </div>

        <div className="grid grid-rows-3 grid-flow-col gap-2 mb-1">
          <Button
            className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
            value={2000}
            name="premium_fee"
            onClick={changeForm}
          >
            IDR 2.000
          </Button>
          <Button
            className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
            value={10000}
            name="premium_fee"
            onClick={changeForm}
          >
            IDR 10.000
          </Button>
          <Button
            className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
            value={20000}
            name="premium_fee"
            onClick={changeForm}
          >
            IDR 20.000
          </Button>
          <Button
            className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
            value={30000}
            name="premium_fee"
            onClick={changeForm}
          >
            IDR 30.000
          </Button>
          <Button
            className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
            value={40000}
            name="premium_fee"
            onClick={changeForm}
          >
            IDR 40.000
          </Button>
          <Button
            className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
            value={50000}
            name="premium_fee"
            onClick={changeForm}
          >
            IDR 50.000
          </Button>
        </div>

        <div className="flex flex-row justify-between mb-5">
          <hr className="w-1/3 mt-3" />
          <Typography className="w-1/3 text-center">
            {t('circle.fee.line')}
          </Typography>
          <hr className="w-1/3 mt-3" />
        </div>
        <Input
          placeholder="Minimum Premium Content IDR. 2,000"
          type="number"
          onChange={changeForm}
          name="premium_fee"
          value={form.premium_fee}
          variant="outlined"
        />
        <p className="text-red-500">{error}</p>

        <Button
          className="w-full mt-9 font-semibold text-sm bg-seeds-button-green rounded-full capitalize"
          disabled={error !== ''}
          onClick={() => {
            setIsOpen(false);
          }}
        >
          Save
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export default ModalChoosePricePremium;
