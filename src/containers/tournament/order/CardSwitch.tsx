import CCard from '@/components/CCard';
import { Switch } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
interface props {
  handleToggle: () => void;
}

const CardSwitch: React.FC<props> = ({ handleToggle }) => {
  const { t } = useTranslation();

  return (
    <CCard className="flex w-full p-4 border-[1px] border-[#E9E9E9] rounded-xl shadow-none ">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-2">
            <p className="text-base md:text-lg font-semibold font-poppins text-black">
              {t('buyAsset.text6')}
            </p>
          </div>
          <p className="text-base md:text-lg font-light text-[#7C7C7C] font-poppins">
            {t('buyAsset.text7')}
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
