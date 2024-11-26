import ChangePhoneNumberEdit from '@/assets/my-profile/editProfile/ChangePhoneNumberEdit.svg';
import DropdownPhone from '@/assets/my-profile/editProfile/DropdownPhone.svg';
import countries from '@/constants/countries.json';
import { checkPhoneNumber, getOtp } from '@/repository/auth.repository';
import { editUserInfo } from '@/repository/profile.repository';
import {
  Button,
  Card,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';

import { ArrowBackwardIcon } from 'public/assets/vector';
import { useState } from 'react';
interface Form {
  form: any;
  setForm: any;
  select: any;
  setSelect: any;
  setNumber: any;
  getOTP: any;
  setCountdown: any;
}

interface CountryCodeInfo {
  name: string;
  flag: string;
  code: string;
  dialCode: string;
}

const ChangePhoneNumber: React.FC<Form> = ({
  form,
  setForm,
  select,
  setSelect,
  setNumber,
  getOTP,
  setCountdown
}: Form) => {
  const [country, setCountry] = useState(0);

  const changeData = (e: any): void => {
    const value = e.target.value;
    if (value === '0') {
      setNumber(value.slice(1));
    } else if (
      value.slice(countries[country].dialCode.replace('+', '')) ===
      countries[country].dialCode
    ) {
      setNumber(
        value.slice(countries[country].dialCode.replace('+', '').length)
      );
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
      setNumber(e.target.value);
    }
  };
  const getCountry = (phone: string): CountryCodeInfo | undefined =>
    countries.find(code => {
      const dialCode = code?.dialCode.replace('+', '');
      return phone.replace('+', '').slice(0, dialCode.length) === dialCode;
    });

  const handleSubmitNumber = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      let updatedForm: any = { ...form };
      updatedForm = {
        ...updatedForm,
        phone: form.phone
      };
      await checkPhoneNumber(form.phone);
      await editUserInfo(updatedForm);
      await getOtp(getOTP);
      setCountdown(60);
      setSelect(2);
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className={`${select === 1 ? 'flex' : 'hidden'} justify-center`}>
        <Card className="flex items-center w-[947px] h-[721px] py-5">
          <form
            onSubmit={handleSubmitNumber}
            className="flex flex-col justify-between items-center w-[600px] h-full p-4"
          >
            <Link
              href="/my-profile/edit-profile"
              className="absolute left-8 cursor-pointer"
            >
              <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
            </Link>
            <div className="flex flex-col items-center gap-8 w-full">
              <Typography className="font-poppins font-semibold text-[#262626] text-base text-center">
                Change Phone Number
                <br />
                <span className="font-poppins font-normal text-sm text-[#7C7C7C] text-center">
                  Please enter the new phone number you will use on Seeds.
                </span>
              </Typography>
              <Image src={ChangePhoneNumberEdit} alt="ChangePhoneNumberEdit" />
              <div className="relative flex w-full">
                <Menu placement="top-start">
                  <MenuHandler>
                    <Button
                      ripple={false}
                      variant="text"
                      className="absolute z-10 flex p-0 gap-[19px] items-center pr-[18px] pb-[7px] pt-[15px] rounded-none hover:bg-transparent focus:border-none"
                    >
                      <img
                        src={`https://flagcdn.com/${
                          getCountry(form.phone)?.code.toLowerCase() as string
                        }.svg`}
                        alt={getCountry.name}
                        className="h-4 w-7 object-cover"
                      />
                      <Image src={DropdownPhone} alt="DropdownPhone" />
                      <Typography className="font-poppins font-normal text-base text-[#7C7C7C]">
                        {getCountry(form?.phone)?.dialCode.replace('+', '')}
                      </Typography>
                    </Button>
                  </MenuHandler>
                  <MenuList className="max-h-[20rem] max-w-[18rem] ">
                    {countries
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(({ name, code }, index) => {
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
                              src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
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
                  label="Your New Phone Number"
                  name="phone"
                  type="number"
                  value={form?.phone}
                  onChange={changeData}
                  variant="static"
                  labelProps={{
                    className:
                      '!text-base !text-[#262626] !font-semibold !font-poppins'
                  }}
                  className="!text-[#7C7C7C] !text-base !font-poppins !font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pl-[110px]"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="capitalize w-full rounded-full font-poppins font-semibold text-sm bg-[#3AC4A0]"
            >
              Change
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ChangePhoneNumber;
