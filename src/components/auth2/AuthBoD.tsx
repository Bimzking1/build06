import type { AuthBoDI } from '@/utils/interfaces/auth.interface';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
  Typography
} from '@material-tailwind/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AuthBoD: React.FC<AuthBoDI> = ({
  error,
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
  handleChangeDoB
}: AuthBoDI) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dayRef = useRef<HTMLElement | null>(null);
  const monthRef = useRef<HTMLElement | null>(null);
  const yearRef = useRef<HTMLElement | null>(null);
  const handleOpen = (): void => {
    setOpen(!open);
  };
  const days = [];
  for (let i = 0; i <= 30; i++) {
    days[i] = i + 1;
  }
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const years = [];
  for (let i = 0; i <= 100; i++) {
    years[i] = i + 1924;
  }

  useEffect(() => {
    if (open) {
      dayRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' });
      monthRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' });
      yearRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, [open]);
  useEffect(() => {
    dayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    monthRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    yearRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [day, month, year]);
  return (
    <>
      <div
        onClick={handleOpen}
        className={`rounded-xl p-[2px] h-full w-full cursor-pointer ${
          error
            ? 'bg-[#FF3838]'
            : 'bg-gradient-to-l from-[#97A4E7] to-[#47C0AA]'
        }`}
      >
        <div className="relative flex bg-white border-none w-full rounded-[10px] h-full">
          <Input
            label={`${t('authRegister.authPersonalData.dob')}`}
            type="number"
            variant="static"
            placeholder={`${t('authRegister.authPersonalData.day')}`}
            name=""
            value={day}
            readOnly
            required
            labelProps={{
              className:
                '!bg-white !w-fit !h-fit !px-1 !ms-3 after:!border-none !font-semibold !font-poppins !text-base !text-[#262626] !leading-[10px]'
            }}
            containerProps={{ className: '!min-w-[70px] !w-[70px]' }}
            className="!border-none focus:!border-none !p-1.5 !ps-4 !font-poppins !font-normal !text-base !text-[#262626] !rounded-[10px] [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:opacity-100 !cursor-pointer"
          />
          <Input
            type="number"
            variant="static"
            placeholder={`${t('authRegister.authPersonalData.month')}`}
            name=""
            value={month !== undefined ? month + 1 : undefined}
            readOnly
            labelProps={{
              className:
                '!bg-white !w-fit !h-fit !px-1 !ms-3 after:!border-none !font-semibold !font-poppins !text-base !text-[#262626] !leading-[10px]'
            }}
            containerProps={{ className: '!min-w-[75px] !w-[75px]' }}
            className="!border-none focus:!border-none !p-1.5 !ps-4 !font-poppins !font-normal !text-base !text-[#262626] !rounded-[10px] [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:opacity-100 !cursor-pointer"
          />
          <Input
            type="number"
            variant="static"
            placeholder={`${t('authRegister.authPersonalData.year')}`}
            name=""
            value={year}
            readOnly
            labelProps={{
              className:
                '!bg-white !w-fit !h-fit !px-1 !ms-3 after:!border-none !font-semibold !font-poppins !text-base !text-[#262626] !leading-[10px]'
            }}
            containerProps={{ className: '!min-w-[85px] !w-[85px]' }}
            className="!border-none focus:!border-none !p-1.5 !ps-4 !font-poppins !font-normal !text-base !text-[#262626] !rounded-[10px] [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:opacity-100 !cursor-pointer"
          />
        </div>
      </div>
      {/* TODO: Dialog BoD */}
      <Dialog
        open={open}
        handler={handleOpen}
        size="sm"
        className="flex flex-col items-center rounded-3xl min-w-full"
        dismiss={{ enabled: false }}
      >
        <DialogBody className="flex gap-8">
          <div className="flex flex-col h-[216px] w-[70px] gap-2 overflow-y-scroll overflow-x-hidden cursor-pointer">
            {month === undefined || year === undefined
              ? days.map((value, index) => {
                  return (
                    <Typography
                      ref={day === value ? dayRef : null}
                      onClick={() => {
                        setDay(value);
                      }}
                      className={`font-poppins text-base text-center hover:bg-[#BDBDBD]/40 rounded-md me-3 ${
                        day === value
                          ? 'text-[#3AC4A0] font-semibold'
                          : 'text-[#BDBDBD] font-normal hover:text-white'
                      }`}
                      key={index}
                    >
                      {value}
                    </Typography>
                  );
                })
              : (month % 2 === 0 && month < 8) ||
                ((month + 1) % 2 === 0 && month >= 8)
              ? days.map((value, index) => {
                  return (
                    <Typography
                      ref={day === value ? dayRef : null}
                      onClick={() => {
                        setDay(value);
                      }}
                      className={`font-poppins text-base text-center hover:bg-[#BDBDBD]/40 rounded-md me-3 ${
                        day === value
                          ? 'text-[#3AC4A0] font-semibold'
                          : 'text-[#BDBDBD] font-normal hover:text-white'
                      }`}
                      key={index}
                    >
                      {value}
                    </Typography>
                  );
                })
              : (month % 2 === 0 && month >= 8) ||
                ((month + 1) % 2 === 0 && month < 8 && month !== 1)
              ? days
                  .filter(number => number < 31)
                  .map((value, index) => {
                    return (
                      <Typography
                        ref={day === value ? dayRef : null}
                        onClick={() => {
                          setDay(value);
                        }}
                        className={`font-poppins text-base text-center hover:bg-[#BDBDBD]/40 rounded-md me-3 ${
                          day === value
                            ? 'text-[#3AC4A0] font-semibold'
                            : 'text-[#BDBDBD] font-normal hover:text-white'
                        }`}
                        key={index}
                      >
                        {value}
                      </Typography>
                    );
                  })
              : month === 1 && year % 4 === 0
              ? days
                  .filter(number => number < 30)
                  .map((value, index) => {
                    return (
                      <Typography
                        ref={day === value ? dayRef : null}
                        onClick={() => {
                          setDay(value);
                        }}
                        className={`font-poppins text-base text-center hover:bg-[#BDBDBD]/40 rounded-md me-3 ${
                          day === value
                            ? 'text-[#3AC4A0] font-semibold'
                            : 'text-[#BDBDBD] font-normal hover:text-white'
                        }`}
                        key={index}
                      >
                        {value}
                      </Typography>
                    );
                  })
              : days
                  .filter(number => number < 29)
                  .map((value, index) => {
                    return (
                      <Typography
                        ref={day === value ? dayRef : null}
                        onClick={() => {
                          setDay(value);
                        }}
                        className={`font-poppins text-base text-center hover:bg-[#BDBDBD]/40 rounded-md me-3 ${
                          day === value
                            ? 'text-[#3AC4A0] font-semibold'
                            : 'text-[#BDBDBD] font-normal hover:text-white'
                        }`}
                        key={index}
                      >
                        {value}
                      </Typography>
                    );
                  })}
          </div>
          <div className="flex flex-col h-[216px] w-fit gap-2 overflow-y-scroll overflow-x-hidden cursor-pointer">
            {months.map((value, index) => {
              return (
                <Typography
                  ref={month === index ? monthRef : null}
                  onClick={() => {
                    setMonth(index);
                  }}
                  className={`font-poppins text-base text-center hover:bg-[#BDBDBD]/40 rounded-md px-2 me-3 ${
                    month === index
                      ? 'text-[#3AC4A0] font-semibold'
                      : 'text-[#BDBDBD] font-normal hover:text-white'
                  }`}
                  key={index}
                >
                  {value}
                </Typography>
              );
            })}
          </div>
          <div className="flex flex-col h-[216px] w-[100px] gap-2 overflow-y-scroll overflow-x-hidden cursor-pointer">
            {years
              .sort((a, b) => b - a)
              .map((value, index) => {
                return (
                  <Typography
                    onClick={() => {
                      setYear(value);
                    }}
                    ref={year === value ? yearRef : null}
                    className={`font-poppins text-base text-center hover:bg-[#BDBDBD]/40 rounded-md me-3 ${
                      year === value
                        ? 'text-[#3AC4A0] font-semibold'
                        : 'text-[#BDBDBD] font-normal hover:text-white'
                    }`}
                    key={index}
                  >
                    {value}
                  </Typography>
                );
              })}
          </div>
        </DialogBody>
        <DialogFooter className="w-full">
          <Button
            onClick={e => {
              handleChangeDoB(e);
              handleOpen();
            }}
            disabled={
              day === undefined || month === undefined || year === undefined
            }
            className="capitalize font-poppins font-semibold text-sm text-white w-full bg-[#3AC4A0] rounded-full"
          >
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AuthBoD;
