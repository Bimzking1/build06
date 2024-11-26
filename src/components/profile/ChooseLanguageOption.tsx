'use client';
import { Radio, Typography } from '@material-tailwind/react';
import Image from 'next/image';

interface Lang {
  id: string;
  label: string;
  logo: any;
}

interface ILangOption {
  option: Lang;
  onChange: (LangOption: Lang) => void;
  currentValue: any;
}

const LangOption = ({
  option,
  onChange,
  currentValue
}: ILangOption): JSX.Element => (
  <div className="flex justify-between rounded-xl border items-center pl-4">
    <div className="flex items-center gap-2">
      <Image
        src={option.logo}
        width={20}
        height={20}
        className="w-auto object-contain object-[center_center]"
        alt={option.label}
      />

      <Typography className="font-poppins text-sm text-black">
        {option.label}
      </Typography>
    </div>
    <Radio
      id={option.id}
      value={option.id}
      name="LangOption"
      className="rounded-xl border"
      color="teal"
      checked={option.id === currentValue}
      onChange={() => {
        onChange(option);
      }}
    />
  </div>
);

export default LangOption;
