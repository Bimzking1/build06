import Eye from '@/assets/my-profile/editProfile/Eye.svg';
import EyeSlash from '@/assets/my-profile/editProfile/EyeSlash.svg';
import { Input } from '@material-tailwind/react';
import Image from 'next/image';
import { useState } from 'react';

interface IAuthPassword {
  handleChange: any;
  formData: string;
  error: boolean;
  name: string;
  label: string;
  placeholder: string;
  handleSubmit: any;
}

const AuthPassword: React.FC<IAuthPassword> = ({
  handleChange,
  formData,
  error,
  name,
  label,
  placeholder,
  handleSubmit
}: IAuthPassword) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-xl p-[2px] h-full w-full ${
        error ? 'bg-[#FF3838]' : 'bg-gradient-to-l from-[#97A4E7] to-[#47C0AA]'
      }`}
    >
      <div className="relative flex justify-center items-center bg-white border-none w-full rounded-[10px] h-full">
        <Input
          label={label}
          type={open ? 'text' : 'password'}
          variant="static"
          placeholder={placeholder}
          name={name}
          value={formData}
          onChange={handleChange}
          required
          onKeyDown={handleSubmit}
          labelProps={{
            className:
              '!bg-white !w-fit !h-fit !px-1 !ms-3 after:!border-none !font-semibold !font-poppins !text-base !text-[#262626] !leading-[10px]'
          }}
          className="!border-none focus:!border-none !p-1.5 !ps-4 !font-poppins !font-normal !text-base !text-[#262626] !rounded-[10px]"
        />
        <Image
          src={open ? Eye : EyeSlash}
          alt="EyePassword"
          className="absolute right-3"
          onClick={() => {
            setOpen(!open);
          }}
        />
      </div>
    </div>
  );
};

export default AuthPassword;
