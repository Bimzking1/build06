import ChecklistInputSecuritySetting from '@/assets/my-profile/editProfile/ChecklistInputSecuritySetting.svg';
import ChevronRight from '@/assets/my-profile/editProfile/ChevronRight.svg';
import NoneInputSecuritySetting from '@/assets/my-profile/editProfile/NoneInputSecuritySetting.svg';
import {
  Input,
  Typography
} from '@/components/MaterialTailwind/MaterialTailwind';
import { useAppSelector } from '@/store/redux/store';
import Image from 'next/image';
import type { ReactElement, ReactNode } from 'react';

interface ISecuritySettingForm {
  form: ReactNode;
  label: string;
  textBlank: string;
  extraChildren?: ReactElement;
  onClick: () => void;
}

const SecuritySettingForm: React.FC<ISecuritySettingForm> = ({
  form,
  label,
  textBlank,
  extraChildren,
  onClick
}: ISecuritySettingForm) => {
  const { dataUser } = useAppSelector(state => state.user);
  return (
    <div onClick={onClick} className="relative flex w-full p-0 bg-transparent">
      <div className="absolute flex p-0 gap-2 items-center pr-[18px] pb-[7px] pt-[15px]">
        {extraChildren !== null && <>{extraChildren}</>}
        <Typography
          className={`${
            form === '' ? 'text-[#7C7C7C]' : 'text-[#262626]'
          } text-base font-poppins font-normal`}
        >
          {form === '' ? textBlank : form}
        </Typography>
        {(label === 'Password' || label === 'Kata Sandi') &&
        dataUser.isPasswordExists ? null : (
          <Image
            src={
              form === ''
                ? NoneInputSecuritySetting
                : ChecklistInputSecuritySetting
            }
            alt="InformationInputIcon"
          />
        )}
      </div>
      <Input
        label={label}
        type="text"
        variant="static"
        labelProps={{
          className: '!text-base !text-[#262626] !font-semibold !font-poppins'
        }}
        className="cursor-pointer"
        readOnly
      />
      <Image
        src={ChevronRight}
        alt="ChevronRight"
        className="absolute right-0 pb-[7px] pt-[15px]"
      />
    </div>
  );
};

export default SecuritySettingForm;
