import { Input } from '@material-tailwind/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';

interface BirthDate {
  wrapperClassName?: string;
  className?: string;
  birthDate: any;
  setBirthDate: any;
}

const BirthDateCalender: React.FC<BirthDate> = ({
  wrapperClassName,
  className,
  birthDate,
  setBirthDate
}: BirthDate) => {
  const { t } = useTranslation();
  const [showMonth, setMonth] = useState(false);
  const [showYear, setYear] = useState(true);
  const [shouldClose, setClose] = useState(false);
  const handleChangeCalender = (): void => {
    if (showYear) {
      setMonth(!showMonth);
      setYear(!showYear);
    } else if (showMonth) {
      setMonth(!showMonth);
      setClose(!shouldClose);
    }
  };
  const handleResetCalender = (): void => {
    setYear(true);
    setClose(false);
  };
  return (
    <DatePicker
      selected={new Date(birthDate)}
      onChange={(date: Date) => {
        setBirthDate(date);
      }}
      showYearPicker={showYear}
      showMonthYearPicker={showMonth}
      onSelect={handleChangeCalender}
      onInputClick={handleResetCalender}
      shouldCloseOnSelect={shouldClose}
      dateFormat="dd/MM/yyyy"
      wrapperClassName={`${wrapperClassName as string}`}
      showPopperArrow={false}
      popperPlacement="top-start"
      customInput={
        <Input
          label={`${t('setting.setting.accountInfo.DoB')}`}
          name="birthDate"
          variant="static"
          labelProps={{
            className: '!text-base !text-[#262626] !font-semibold !font-poppins'
          }}
          className="!text-[#7C7C7C] !text-base !font-poppins !font-normal"
          style={{ backgroundColor: 'transparent' }}
        />
      }
    />
  );
};

export default BirthDateCalender;
