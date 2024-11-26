import DropdownPhone from '@/assets/my-profile/editProfile/DropdownPhone.svg';
import { Input, Option, Select, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface ISettingNumberInput {
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    dialCode: string
  ) => void;
  formData: string;
  name: string;
  country: number;
  setCountry: any;
  countries: any;
  error: boolean;
  handleSubmit: (e: any) => void;
}

const SettingNumberInput: React.FC<ISettingNumberInput> = ({
  handleChange,
  formData,
  name,
  country,
  countries,
  setCountry,
  error,
  handleSubmit
}: ISettingNumberInput) => {
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-xl p-[2px] h-full w-full ${
        error ? 'bg-[#FF3838]' : 'bg-gradient-to-l from-[#97A4E7] to-[#47C0AA]'
      }`}
    >
      <div className="relative flex justify-center items-center bg-white border-none w-full rounded-[10px] h-full">
        <Select
          variant="static"
          label={t('authLogin.phone').toString()}
          arrow={<Image src={DropdownPhone} alt="DropdownPhone" />}
          selected={() => {
            return (
              <div className="absolute top-1/2 -translate-y-1/2 left-1.5 ms-3 flex items-center gap-2">
                <img
                  src={`https://flagcdn.com/${
                    countries[country]?.code.toLowerCase() as string
                  }.svg`}
                  alt={countries[country].name}
                  className="h-4 w-7 object-cover"
                />

                <Typography className="font-poppins font-normal text-base text-[#7C7C7C]">
                  {countries[country]?.dialCode}
                </Typography>
              </div>
            );
          }}
          className="!border-none focus:!border-none !p-1.5"
          labelProps={{
            className:
              '!bg-white !w-[133px] !h-fit !px-1 !ms-3 after:!border-none !font-semibold !font-poppins !text-base !text-[#262626] !leading-[10px]'
          }}
          containerProps={{
            className: `${
              countries[country].dialCode.replace('+', '').length < 2
                ? '!min-w-[102px] !w-[102px]'
                : countries[country].dialCode.replace('+', '').length < 3
                ? '!min-w-[116px] !w-[116px]'
                : countries[country].dialCode.replace('+', '').length < 4
                ? '!min-w-[127px] !w-[127px]'
                : '!min-w-[133px] !w-[133px]'
            }`
          }}
          menuProps={{ className: '!w-[250px]' }}
        >
          {countries
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
            .map((value: any, index: any) => {
              return (
                <Option
                  key={index}
                  value={value.name}
                  className="flex items-center gap-2"
                  onClick={() => {
                    setCountry(index);
                  }}
                >
                  <img
                    src={`https://flagcdn.com/${
                      value.code.toLowerCase() as string
                    }.svg`}
                    alt={value.name}
                    className="h-5 w-5 object-cover"
                  />
                  {value.name}
                </Option>
              );
            })}
        </Select>
        <Input
          type="number"
          variant="static"
          placeholder="85XXX"
          name={name}
          pattern="[0-9]"
          value={formData}
          onKeyDown={handleSubmit}
          onChange={e => {
            handleChange(e, countries[country].dialCode.replace('+', ''));
          }}
          labelProps={{
            className:
              '!bg-white !w-fit !h-fit !px-1 !ms-3 after:!border-none !font-semibold !font-poppins !text-base !text-[#262626] !leading-[10px]'
          }}
          className="!border-none focus:!border-none !p-1.5 !font-poppins !font-normal !text-base !text-[#262626] !rounded-[10px] leading-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
};

export default SettingNumberInput;
