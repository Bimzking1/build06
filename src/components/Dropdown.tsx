import type { ILanguage } from '@/utils/interfaces/components.interfaces';
import Image from 'next/image';
import { useState } from 'react';

export default function Dropdown({
  options,
  onClick
}: {
  options: ILanguage[];
  onClick: any;
}): React.ReactElement {
  const [showOption, setShowOption] = useState(false);
  const lastLanguage = 'id';

  //   alert();

  const defaultValue = options?.filter(
    language => language?.id === lastLanguage
  )[0];
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const dropdownHandler = (value: any) => {
    setSelectedOption(value);
    Boolean(onClick) && onClick(value);
    setShowOption(false);
  };
  return (
    <div
      className="border rounded-full py-2 px-4 flex items-center justify-between bg-white w-max cursor-pointer shadow-md"
      onClick={() => {
        setShowOption(!showOption);
      }}
    >
      <Image src={selectedOption?.icon} width={25} height={25} alt="asds" />
      <p className="ml-3 font-semibold">{selectedOption?.label}</p>
      {showOption && (
        <div className="border lg:w-36 mt-2 rounded-lg absolute bg-white z-50">
          {options?.map((item, i) => (
            <div
              key={i}
              className="p-3 cursor-pointer hover:bg-green-200 hover:text-white flex"
              onClick={() => {
                dropdownHandler(item);
              }}
            >
              <Image
                src={item?.icon}
                width={25}
                height={25}
                alt="asds"
                className="mr-2"
              />
              <div>{item?.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
