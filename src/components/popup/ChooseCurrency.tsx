import close from '@/assets/more-option/close.svg';
import { getMarketCurrency } from '@/repository/market.repository';
import { updatePreferredCurrency } from '@/repository/user.repository';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { ChooseCurrencyModal } from 'public/assets/images';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SuccessCurrencyPopup from './SuccessCurrencyPopUp';

interface props {
  open: boolean;
  handleOpen: () => void;
}

interface CurrencyDTO {
  name: string;
  short_code: string;
  logo: string;
}

const ChooseCurrencyPopup: React.FC<props> = ({ open, handleOpen }) => {
  const [dropDownCurrency, setDropDownCurrency] = useState<boolean>(false);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [listCurrency, setListCurrency] = useState<CurrencyDTO[]>([]);
  const fetchListCurrency = async (): Promise<void> => {
    try {
      const response = await getMarketCurrency();
      setCurrency(response.data[0].short_code);
      setValue(
        (response.data[0].name as string) +
          ` (${response.data[0].short_code as string})`
      );
      setListCurrency(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitPreferredCurrency = async (): Promise<void> => {
    try {
      setIsLoading(true);
      handleOpen();
      await updatePreferredCurrency(currency);
      setTimeout(() => {
        handleModalSuccess();
      }, 500);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchListCurrency();
  }, []);

  const handleModalSuccess = (): void => {
    setModalSuccess(!modalSuccess);
  };

  return (
    <>
      <Dialog
        dismiss={{
          outsidePress: false
        }}
        open={open}
        size="sm"
        handler={handleOpen}
        className="text-center p-3 max-w-[90%] rounded-2xl"
      >
        <DialogHeader className="p-0 font-poppins">
          <div className="min-w-full flex items-center justify-end">
            <div className="mb-4">
              <Image
                src={close}
                alt="close"
                className="cursor-pointer"
                onClick={() => {
                  handleOpen();
                }}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="p-0 mb-6 font-poppins">
          <Image src={ChooseCurrencyModal} alt="close" className="w-full" />
          <p className="text-base font-semibold leading-6 text-gray-900 mb-1 mt-4">
            {t('chooseCurrency.header')}
          </p>
          <p className="font-normal text-sm mb-4">{t('chooseCurrency.body')}</p>
          <div className="flex justify-start">
            <div className="flex justify-center flex-col absolute right-2 pt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#262626"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="text"
              value={value}
              onClick={() => {
                setDropDownCurrency(!dropDownCurrency);
              }}
              className={`h-10 caret-white ${
                dropDownCurrency
                  ? 'border-2 border-seeds-green'
                  : 'border border-[#7C7C7C]'
              } py-6 px-3 text-black rounded-xl w-full outline-none`}
            />
            {dropDownCurrency && (
              <div className="absolute mt-14 max-h-[200px] overflow-auto bg-white w-full rounded-xl border pt-2">
                {listCurrency.map((el: CurrencyDTO, idx: number) => {
                  return (
                    <div
                      className={`flex my-1 mx-3 py-2 px-3 rounded-md items-center cursor-pointer ${
                        el.short_code === currency ? 'bg-[#DCFCE4]' : 'bg-white'
                      }`}
                      onClick={() => {
                        setValue(el.name + ` (${el.short_code})`);
                        setDropDownCurrency(false);
                        setCurrency(el.short_code);
                      }}
                      key={idx}
                    >
                      <Typography className="text-sm font-normal leading-6 text-gray-900">
                        {el.name + ` (${el.short_code})`}
                      </Typography>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="p-0">
          <Button
            className="rounded-full min-w-full capitalize font-semibold text-sm bg-[#3AC4A0] text-white font-poppins"
            onClick={() => {
              submitPreferredCurrency().catch(err => {
                console.log(err);
              });
            }}
            disabled={isLoading}
          >
            {t('button.label.save')}
          </Button>
        </DialogFooter>
      </Dialog>
      <SuccessCurrencyPopup
        open={modalSuccess}
        handleModal={handleModalSuccess}
        currency={currency}
      />
    </>
  );
};
export default ChooseCurrencyPopup;
