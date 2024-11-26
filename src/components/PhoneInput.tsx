'use client';
import type { AssetsInterface } from '@/constants/assets';
import Flags from '@/constants/assets/flags';
import ListCountryFlag from '@/constants/countryFlag';
import { Input } from '@material-tailwind/react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface PhoneInputProps {
  onChangePhoneNumber: (value: string) => void;
  errorMessage?: string;
  label?: string;
  error: boolean;
  phoneValue: string;
  selectedCode: string;
  setSelectedCode: (value: string) => void;
  name?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  onChangePhoneNumber,
  error,
  label,
  selectedCode,
  setSelectedCode,
  phoneValue,
  name
}) => {
  const [dropdownVisibility, setDropdowVisibility] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState('ID');

  const displayedPhoneNumber = useMemo(() => {
    const numericPhoneNumber = phoneValue.replace(/\D/g, '');
    const spacedPhoneNumber = numericPhoneNumber.replace(
      /(\d{3})(\d{4})(\d{4})/,
      '$1 $2 $3'
    );
    return spacedPhoneNumber;
  }, [phoneValue]);

  const renderSafeFlag = (countryCode: string): AssetsInterface => {
    const defaultCountryCode = 'ID';
    return Flags[countryCode] ?? Flags[defaultCountryCode];
  };

  return (
    <div className="flex flex-col">
      <div className="relative ">
        <div className="flex gap-2 items-baseline">
          {/* Country and arrow image */}
          <div
            onClick={() => {
              setDropdowVisibility(!dropdownVisibility);
            }}
            className="grid grid-cols-2 gap-2 items-baseline"
          >
            <Image
              src={renderSafeFlag(selectedFlag).src}
              alt={renderSafeFlag(selectedFlag).alt}
              width={20}
              height={20}
              className="h-auto w-auto object-contain object-[center_center]"
            />
            <div className="w-3">
              <svg
                viewBox="0 0 19 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.56093 8.23855L7.56076 8.2387L9.81026 10.2973L12.0603 8.2387L12.0599 8.23835L18.8105 2.06002L16.5605 -9.83538e-08L9.81055 6.17916L3.06062 -6.88451e-07L0.810547 2.06002L7.56093 8.23855Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
          <span className="text-md flex-1">{selectedCode}</span>
          {/* Input field */}
          <div className="w-full">
            <Input
              className="w-full text-lg"
              type="tel"
              size="md"
              color="gray"
              variant="standard"
              name={name ?? 'phoneNumber'}
              onChange={e => {
                onChangePhoneNumber(e.target.value);
              }}
              value={displayedPhoneNumber}
              error={error}
              label={label}
            />
          </div>
        </div>
      </div>
      {/* list of country */}
      {dropdownVisibility ? (
        <div className="relative z-20">
          <div className="w-full absolute top-0 h-44 overflow-auto">
            {ListCountryFlag.map((country, idx) => (
              <div
                onClick={() => {
                  setDropdowVisibility(false);
                  setSelectedFlag(country.img);
                  setSelectedCode(country.code);
                }}
                className="px-4 py-2 flex gap-4 items-center bg-white top-0 w-full hover:bg-slate-50"
                data-value={country.code}
                data-img={`/assets/images/${country.img}.png`}
                key={idx}
              >
                <Image
                  src={renderSafeFlag(country.img).src}
                  alt={renderSafeFlag(country.img).alt}
                  width={20}
                  height={20}
                  className="h-auto w-auto object-contain object-[center_center]"
                />
                <p>{`${country.name} (${country.code})`}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PhoneInput;
