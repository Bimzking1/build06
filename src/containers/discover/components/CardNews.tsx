import Image from 'next/image';
import avatar from '../../../assets/avatar.png';
import bg from '../../../assets/news.png';

export default function CardNews(): React.ReactElement {
  return (
    <div
      className="rounded-lg bg-no-repeat bg-cover lg:min-w-full min-w-max"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div
        className={`rounded-lg space-y-3 p-3 bg-gradient-to-r from-[#106B6E] to-transparent`}
      >
        <div className="flex gap-2 text-white text-sm items-center">
          <Image src={avatar} alt="avatar" width={30} height={30} />
          Rober Hans
        </div>
        <p className="text-white font-semibold text-xl max-w-[50%]">
          Apple : New fitur from Iphone 13 pro
        </p>
        <button className="bg-seeds-purple rounded-full py-1 px-3  text-xs text-white">
          Trends
        </button>
        <p className="text-white font-light">12 Hours Ago</p>
      </div>
    </div>
  );
}
