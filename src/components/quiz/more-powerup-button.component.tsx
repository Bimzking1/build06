import { type LifelinesEnum } from '@/utils/interfaces/quiz.interfaces';
import { memo, useMemo } from 'react';

interface Props {
  isPowerUpOpt?: boolean;
  value?: number | LifelinesEnum;
  text?: string | LifelinesEnum;
  selected: number | LifelinesEnum | null;
  onClick: () => void;
  price?: string;
}

const MorePowerUpButton: React.FC<Props> = ({
  isPowerUpOpt = true,
  selected,
  onClick,
  value,
  text,
  price
}) => {
  const colorBackground = useMemo(() => {
    return {
      disabled: {
        background: '#BDBDBD',
        innerBackground: '#E9E9E9'
      },
      enabled: {
        background: '#9975FE',
        innerBackground: '#B798FF'
      }
    };
  }, []);

  const isSelected = selected === value;

  return (
    <div
      className="rounded-xl mb-3 w-full h-[53px] cursor-pointer hover:opacity-80"
      style={{
        backgroundColor: isSelected
          ? colorBackground.enabled.background
          : colorBackground.disabled.background
      }}
      onClick={onClick}
    >
      <div
        className="rounded-xl mb-3 w-full h-[46px] flex justify-center items-center px-4"
        style={{
          backgroundColor: isSelected
            ? colorBackground.enabled.innerBackground
            : colorBackground.disabled.innerBackground
        }}
      >
        {isPowerUpOpt ? (
          <div className="w-full flex justify-between">
            <div className="flex items-center gap-3">
              <div
                className="rounded-full h-7 w-7 flex justify-center items-center text-base text-white font-bold"
                style={{
                  backgroundColor: isSelected ? '#7555DA' : '#7C7C7C'
                }}
              >
                +{value}
              </div>
              <span
                className="text-base text-white font-bold"
                style={{
                  color: isSelected
                    ? 'white'
                    : colorBackground.disabled.background
                }}
              >
                POWER UP
              </span>
            </div>

            <div
              className="rounded-full flex justify-center text-white py-1 px-3 text-sm"
              style={{
                backgroundColor: isSelected
                  ? '#FFAC33'
                  : colorBackground.disabled.background,
                border: '2px solid',
                borderColor: isSelected ? '#FFCC4D' : '#7C7C7C'
              }}
            >
              <span>IDR {price}</span>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center text-lg"
            style={{ color: isSelected ? 'white' : 'black' }}
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MorePowerUpButton);
