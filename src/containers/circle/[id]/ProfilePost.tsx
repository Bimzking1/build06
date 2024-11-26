import { getUserInfo } from '@/repository/profile.repository';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
interface typeOfSelection {
  name: string;
  svg: any;
  message: string;
  type: string;
}

interface props {
  handleDropDown: any;
  dropVal: any;
  drop: boolean;
  dataSelection: typeOfSelection[];
  handleInputChange: any;
}

interface UserData {
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
  _pin: string;
}

const ProfilePost: React.FC<props> = ({
  handleDropDown,
  dropVal,
  drop,
  dataSelection,
  handleInputChange
}) => {
  const [userInfo, setUserInfo] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await getUserInfo();
        setUserInfo(response);
      } catch (error) {
        console.log(error);
      }
    };

    void fetchData();
  }, []);

  return (
    <div className="flex justify-start gap-3">
      <img
        alt="bg-avatar-sm"
        src={userInfo?.avatar}
        className="h-[48px] w-[48px] rounded-full object-cover"
      />
      <div className="flex flex-col">
        <div className="flex">
          <h1 className="text-[#262626] font-semibold font-poppins text-base">
            {userInfo?.name}
          </h1>
          <div className="hidden flex-col justify-center pl-3 sm:flex">
            <button className="font-poppins text-xs" onClick={handleDropDown}>
              <div className="flex w-fit px-2 rounded-full bg-neutral-ultrasoft gap-1">
                <div className="flex items-center">
                  <Image
                    alt="type"
                    src={dropVal.svg}
                    className="h-3 w-3 rounded-full"
                  />
                </div>
                <Typography className="text-black text-xs font-poppins">
                  {dropVal.type}
                </Typography>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M4.16516 6.61704L5.60796 8.30893C5.82521 8.56369 6.17616 8.56369 6.39342 8.30893L7.83622 6.61704C8.18717 6.2055 7.93649 5.5 7.4407 5.5H4.5551C4.05931 5.5 3.81421 6.2055 4.16516 6.61704Z"
                    fill="#262626"
                  />
                </svg>
              </div>
            </button>
            {drop ? (
              <div className="bg-white absolute z-[10] mt-[40vh] rounded-2xl border border-neutral-soft w-[340px] flex flex-col justify-center items-center transition">
                {dataSelection.map((el: typeOfSelection, i) => {
                  return (
                    <label
                      className="cursor-default"
                      key={`${i}radioSelection`}
                    >
                      <input
                        type="radio"
                        className="peer sr-only"
                        name="type"
                        onChange={handleInputChange}
                        value={el.name}
                      />
                      <div className="w-[300px] my-3 cursor-pointer z-50 rounded-md bg-white p-2 text-gray-600 ring-1 ring-[#7C7C7C] transition-all hover:shadow hover:text-seeds-green hover:ring-seeds-green hover:ring-offset-1">
                        <div className="flex gap-2">
                          <div className="flex flex-col justify-center">
                            <Image
                              alt="public"
                              src={el.svg}
                              className="h-[22px] w-[22px] object-cover"
                            />
                          </div>
                          <div className="flex justify-between w-full gap-5 ">
                            <div className="flex flex-col justify-start">
                              <p className="text-xs font-semibold font-poppins text-[#262626]">
                                {el.name}
                              </p>
                              <p className="text-xs font-poppins text-[#7C7C7C]">
                                {el.message}
                              </p>
                            </div>
                            <div className="flex flex-col justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24">
                                <path
                                  fill="currentColor"
                                  d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <h1 className="text-[#7C7C7C] font-normal font-poppins text-sm">
          @{userInfo?.seedsTag}
        </h1>
      </div>
    </div>
  );
};
export default ProfilePost;
