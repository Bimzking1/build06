import { Input } from '@material-tailwind/react';

interface ISettingCommonInput {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  divClassName: string;
  className: string;
  extraClassesTop?: React.ReactNode;
  extraClassesBottom?: React.ReactNode;
  error?: boolean;
  maxLength?: number;
  placeholder?: string;
  readOnly?: boolean;
  onClick?: () => void;
}

const SettingCommonInput: React.FC<ISettingCommonInput> = ({
  label,
  name,
  value,
  onChange,
  divClassName,
  className,
  extraClassesTop,
  extraClassesBottom,
  error,
  maxLength,
  placeholder,
  readOnly,
  onClick
}: ISettingCommonInput) => {
  return (
    <div className={divClassName}>
      {extraClassesTop}
      <Input
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        variant="static"
        labelProps={{
          className: '!text-base !text-[#262626] !font-semibold !font-poppins'
        }}
        className={className}
        error={error}
        maxLength={maxLength}
        placeholder={placeholder}
        readOnly={readOnly}
        onClick={onClick}
      />
      {extraClassesBottom}
    </div>
  );
};

export default SettingCommonInput;
