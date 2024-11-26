import type { ChangeEvent } from 'react';

interface Props {
  label?: string;
  type?: string | 'outline';
  name: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: any;
  placeholder?: string;
  prefix?: string | React.ReactElement;
  isReadOnly?: boolean;
  isDisable?: boolean;
  isError?: string;
}

export function SearchCircle({
  label,
  type = '',
  onChange,
  name,
  value = '',
  placeholder,
  prefix,
  isReadOnly,
  isDisable,
  isError
}: Props): React.ReactElement {
  const variants: any = {
    '': `py-3 border-b border-[#BDBDBD]`,
    outline: `p-3 rounded-2xl border border-[#BDBDBD]`
  };

  function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) {
      onChange(event);
    }
  };

  return (
    <>
      <div className="relative">
        <input
          type="text"
          onChange={handleChange}
          name={name}
          value={value}
          placeholder={placeholder}
          readOnly={isReadOnly}
          disabled={isDisable}
          className={classNames(
            variants[type],
            'block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9]'
          )}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {prefix}
        </div>
      </div>
    </>
  );
}
