import { Input } from '@material-tailwind/react';

interface IAuthCommonInput {
  handleChange: any;
  formData: string;
  placeholder: string;
  label: string;
  type: string;
  name: string;
  error: boolean;
  required: boolean;
  handleSubmit: (e: any) => void;
}

const AuthCommonInput: React.FC<IAuthCommonInput> = ({
  handleChange,
  formData,
  placeholder,
  label,
  type,
  name,
  error,
  required,
  handleSubmit
}: IAuthCommonInput) => {
  return (
    <div
      className={`rounded-xl p-[2px] h-full w-full ${
        error ? 'bg-[#FF3838]' : 'bg-gradient-to-l from-[#97A4E7] to-[#47C0AA]'
      }`}
    >
      <div className="relative flex justify-center items-center bg-white border-none w-full rounded-[10px] h-full">
        <Input
          label={label}
          type={type}
          variant="static"
          placeholder={placeholder}
          name={name}
          value={formData}
          onChange={handleChange}
          required={required}
          maxLength={name === 'name' ? 50 : undefined}
          onKeyDown={handleSubmit}
          labelProps={{
            className:
              '!bg-white !w-fit !h-fit !px-1 !ms-3 after:!border-none !font-semibold !font-poppins !text-base !text-[#262626] !leading-[10px]'
          }}
          className="!border-none focus:!border-none !p-1.5 !ps-4 !font-poppins !font-normal !text-base !text-[#262626] !rounded-[10px]"
        />
      </div>
    </div>
  );
};

export default AuthCommonInput;
