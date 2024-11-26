/* eslint-disable @next/next/no-img-element */
import DropdownPhone from '@/assets/my-profile/editProfile/DropdownPhone.svg';
import { type AuthNumberI } from '@/utils/interfaces/auth.interface';
import {
  Button,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const AuthNumber = <T extends Record<string, any>>({
  handleChange,
  formData,
  setFormData,
  name,
  country,
  countries,
  setCountry,
  handleSubmit,
  error,
  setError
}: AuthNumberI<T>): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-xl p-[2px] h-full w-full ${
        error === true
          ? 'bg-[#FF3838]'
          : 'bg-gradient-to-l from-[#97A4E7] to-[#47C0AA]'
      }`}
    >
      <div className="relative flex justify-center items-center bg-white border-none w-full rounded-[10px] h-full">
        <Menu placement="top-start">
          <MenuHandler>
            <Button
              ripple={false}
              variant="text"
              className="absolute left-4 z-10 flex p-0 gap-2 items-center rounded-none hover:bg-transparent focus:border-none"
            >
              <img
                src={`https://flagcdn.com/${countries[
                  country
                ]?.code.toLowerCase()}.svg`}
                alt={countries[country].name}
                className="h-4 w-7 object-cover"
              />

              <Typography className="font-poppins font-normal text-base text-[#7C7C7C]">
                {countries[country]?.dialCode}
              </Typography>
              <Image src={DropdownPhone} alt="DropdownPhone" />
            </Button>
          </MenuHandler>
          <MenuList className="max-h-[20rem] max-w-[18rem] ">
            {countries
              .sort((a: any, b: any) => a.name.localeCompare(b.name))
              .map(({ name, code }: any, index: number) => {
                return (
                  <MenuItem
                    key={name}
                    value={name}
                    className="flex items-center gap-2"
                    onClick={() => {
                      setCountry(index);
                    }}
                  >
                    <img
                      src={`https://flagcdn.com/${
                        code.toLowerCase() as string
                      }.svg`}
                      alt={name}
                      className="h-5 w-5 object-cover"
                    />
                    {name}
                  </MenuItem>
                );
              })}
          </MenuList>
        </Menu>
        <Input
          label={t('authLogin.phone').toString()}
          type="text"
          variant="static"
          placeholder="85XXX"
          name={name}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={13}
          value={formData.phoneNumber}
          onKeyDown={handleSubmit}
          onPaste={e => {
            e.preventDefault();
            return false;
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (setError !== undefined) {
              setError(false);
            }
            handleChange(
              e,
              countries[country].dialCode.replace('+', ''),
              formData,
              setFormData
            );
          }}
          required
          labelProps={{
            className:
              '!bg-white !w-fit !h-fit !px-1 !ms-3 after:!border-none !font-semibold !font-poppins !text-base !text-[#262626] !leading-[10px]'
          }}
          className={`!border-none focus:!border-none !p-1.5 !font-poppins !font-normal !text-base !text-[#262626] !rounded-[10px] leading-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            countries[country].dialCode.replace('+', '').length < 2
              ? '!ps-24'
              : countries[country].dialCode.replace('+', '').length < 3
              ? '!ps-28'
              : '!ps-32'
          }`}
        />
      </div>
    </div>
  );
};

export default AuthNumber;
