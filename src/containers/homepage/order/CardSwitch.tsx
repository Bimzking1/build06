import CCard from '@/components/CCard';
import { Switch } from '@material-tailwind/react';

interface props {
  handleToggle: () => void;
}

const CardSwitch: React.FC<props> = ({ handleToggle }) => {
  return (
    <CCard className="flex w-full p-4 border-none rounded-xl shadow-none bg-[#F9F9F9]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-2">
            <p className="text-base md:text-lg font-semibold font-poppins text-black">
              Activate Take Profit and Stop Loss
            </p>
          </div>
          <p className="text-base md:text-lg font-light text-[#7C7C7C] font-poppins">
            Advance your strategy and win the arena.
          </p>
        </div>
        <div className="flex items-center">
          <Switch
            id="custom-switch-component"
            ripple={false}
            className="h-full w-full checked:bg-[#3AC4A0]"
            containerProps={{
              className: 'w-11 h-6'
            }}
            circleProps={{
              className: 'before:hidden left-0.5 border-none'
            }}
            onClick={handleToggle}
          />
        </div>
      </div>
    </CCard>
  );
};

export default CardSwitch;
