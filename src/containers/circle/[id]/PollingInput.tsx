import {
  IconButton,
  Input,
  Checkbox as MTCheckbox,
  Typography
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';

import 'react-datepicker/dist/react-datepicker.css';

interface props {
  setPages: any;
  form: any;
  setIsError: any;
  setErrorMessage: any;
}

export const PollInput: React.FC<props> = ({
  setPages,
  form,
  setErrorMessage,
  setIsError
}) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<string[]>([]);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isMultiVote, setIsMultiVote] = useState(false);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState<Date>();
  const [shouldAllowNewOption, setShouldAllowNewOption] = useState(false);

  const deletePolling = (index: number): void => {
    setOptions([...options.filter((_, i) => i !== index)]);
  };

  const onDone = (): void => {
    form.polling = {
      options: options.map(option => ({ content_text: option, media_url: '' })),
      isMultiVote,
      canAddNewOption: shouldAllowNewOption,
      endDate: hasEndDate && endDate
    };
    setPages('text');
  };

  const onCancel = (): void => {
    setPages('text');
  };

  return (
    <div className="rounded-lg border border-[#BDBDBD] w-fit my-4 p-4">
      <div>
        {options.map((value, index) => (
          <Option
            key={index}
            value={value}
            onChange={val => {
              if (val === undefined) return;
              if (val.length < 1) {
                deletePolling(index);
                return;
              }
              setOptions([
                ...options.map((e, i) => {
                  if (i === index) {
                    e = val;
                  }
                  return e;
                })
              ]);
            }}
            onButtonClick={() => {
              deletePolling(index);
            }}
          />
        ))}
        {options.length < 6 && (
          <OptionInput
            key="new"
            label={t('input.poll.optionPlaceholder', {
              index: options.length + 1
            })}
            onButtonClick={newOption => {
              setOptions([...options, newOption]);
            }}
            setErrorMessage={setErrorMessage}
            setIsDisable={setIsDisable}
            setIsError={setIsError}
          />
        )}
      </div>
      <div className="flex flex-col">
        <CheckBox
          checked={hasEndDate}
          date={endDate}
          setDate={setEndDate}
          onChange={() => {
            setHasEndDate(!hasEndDate);
          }}
          label={t('input.poll.endDateLabel')}
        />
        <CheckBox
          checked={isMultiVote}
          onChange={() => {
            setIsMultiVote(!isMultiVote);
          }}
          label={t('input.poll.multivoteLabel')}
        />
        <CheckBox
          checked={shouldAllowNewOption}
          onChange={() => {
            setShouldAllowNewOption(!shouldAllowNewOption);
          }}
          label={t('input.poll.allowNewOptionLabel')}
        />
      </div>
      <div className="flex">
        <button
          onClick={onCancel}
          type="button"
          className="flex w-40 mx-2 justify-center py-2 items-center rounded-full px-6 text-[#7555DA] border border-[#7555DA] font-semibold font-poppins h-fit"
        >
          Cancel
        </button>
        <button
          onClick={onDone}
          disabled={options.length < 1 || isDisable}
          type="button"
          className={`flex w-40 mx-2 justify-center py-2 items-center rounded-full px-6 font-semibold font-poppins h-fit ${
            options.length < 1
              ? 'bg-[#BDBDBD] text-[#7C7C7C]'
              : 'bg-seeds-button-green text-white'
          }`}
        >
          Done
        </button>
      </div>
    </div>
  );
};

interface CheckBoxProps {
  onChange: () => void;
  label: string;
  checked?: boolean;
  date?: Date;
  setDate?: any;
}
const CheckBox: React.FC<CheckBoxProps> = ({
  onChange,
  label,
  checked,
  date,
  setDate
}) => {
  const renderLabel = (): any => {
    if (setDate != null && (checked ?? false)) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      return (
        <div>
          <Typography variant="small" className="text-black lg:font-small">
            {label}
          </Typography>
          <DatePicker
            minDate={tomorrow}
            selected={date}
            onChange={setDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            className="text-sm text-black"
          />
        </div>
      );
    }

    return (
      <Typography variant="small" className="text-black lg:font-small">
        {label}
      </Typography>
    );
  };

  return (
    <div className="flex items-center">
      <MTCheckbox
        id={label}
        className="p-0 m-0"
        checked={checked}
        onChange={onChange}
        color="green"
      />
      {renderLabel()}
    </div>
  );
};

interface OptionProps {
  onChange: (value: string) => void;
  value: string;
  onButtonClick: () => void;
}

const Option: React.FC<OptionProps> = ({ onChange, onButtonClick, value }) => {
  return (
    <div className="relative flex w-full max-w-[24rem] h-fit">
      <Input
        variant="static"
        className="h-8"
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
      />
      <IconButton
        size="sm"
        color={'gray'}
        className="!absolute right-1 top-3 rounded-full w-6 h-6 text-xl pb-4 bg-[#E9E9E9]"
        onClick={onButtonClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3.79102 10.8097L3.18945 10.2082L6.39779 6.99984L3.18945 3.7915L3.79102 3.18994L6.99935 6.39827L10.2077 3.18994L10.8092 3.7915L7.60091 6.99984L10.8092 10.2082L10.2077 10.8097L6.99935 7.6014L3.79102 10.8097Z"
            fill="#BDBDBD"
          />
        </svg>
      </IconButton>
    </div>
  );
};

interface OptionInputProps {
  onButtonClick: (value: string) => void;
  label: string;
  setIsError: any;
  setIsDisable: any;
  setErrorMessage: any;
}

const OptionInput: React.FC<OptionInputProps> = ({
  onButtonClick,
  label,
  setErrorMessage,
  setIsDisable,
  setIsError
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  useEffect(() => {
    if (value.length > 250) {
      setIsError(true);
      setIsDisable(true);
      setErrorMessage(`${t('social.errorState.poll1')}`);
    } else {
      setIsDisable(false);
    }
  }, [value]);
  return (
    <div className="relative flex w-full max-w-[24rem] h-fit">
      <Input
        variant="static"
        placeholder={label}
        className="h-8"
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
      />
      <IconButton
        size="sm"
        color={'gray'}
        disabled={value.length < 1}
        className="!absolute right-1 top-3 rounded-full w-6 h-6 text-xl pb-4 bg-[#DCFCE4] rotate-45"
        onClick={() => {
          onButtonClick(value);
          setValue('');
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3.79102 10.8097L3.18945 10.2082L6.39779 6.99984L3.18945 3.7915L3.79102 3.18994L6.99935 6.39827L10.2077 3.18994L10.8092 3.7915L7.60091 6.99984L10.8092 10.2082L10.2077 10.8097L6.99935 7.6014L3.79102 10.8097Z"
            fill="#3AC4A0"
          />
        </svg>
      </IconButton>
    </div>
  );
};
