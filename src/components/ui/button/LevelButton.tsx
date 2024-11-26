import Image from 'next/image';
import {
  SaplingIcon,
  SeedIcon,
  SeedlingIcon,
  SproutIcon,
  TreeIcon
} from 'public/assets/vector';

interface LevelButtonProps {
  type: string;
}

const LevelButton: React.FC<LevelButtonProps> = ({ type }) => {
  let buttonIcon;

  if (type === 'Seed') {
    buttonIcon = SeedIcon;
  } else if (type === 'Sprout') {
    buttonIcon = SproutIcon;
  } else if (type === 'Seedling') {
    buttonIcon = SeedlingIcon;
  } else if (type === 'Sapling') {
    buttonIcon = SaplingIcon;
  } else if (type === 'Tree') {
    buttonIcon = TreeIcon;
  }

  return (
    <button className="flex gap-1 h-7 px-1.5 py-1 rounded-full bg-[#4FE6AF] hover:bg-[#3AC4A0]/[0.8] active:bg-[#3AC4A0]">
      <span className="flex justify-center items-center w-5 h-5 rounded-full bg-[#BAFBD0]">
        <Image src={buttonIcon} alt={`${type} Icon`} />
      </span>
      <span className="mt-[0.5px] font-semibold leading-4 text-xs text-white">
        {type}
      </span>
    </button>
  );
};

export default LevelButton;
