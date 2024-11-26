import CloseEditProfile from '@/assets/my-profile/editProfile/CloseEditProfile.svg';
import { avatarList } from '@/repository/auth.repository';
import { Avatar, Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface VariableAvatar {
  className: string;
  setSelect: any;
  handleAvatar: any;
}

const SectionAvatar: React.FC<VariableAvatar> = ({
  className,
  setSelect,
  handleAvatar
}: VariableAvatar) => {
  const [selected, setSelected] = useState('');
  const [gender, setGender] = useState('male');
  const [avatars, setAvatars] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await avatarList(gender);
        setAvatars(response.avatars);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, [gender]);
  return (
    <div className={`${className} justify-center`}>
      <Card className="flex items-center w-[947px] p-5 gap-8">
        <Image
          src={CloseEditProfile}
          alt="CloseEditProfile"
          className="self-start cursor-pointer"
          onClick={() => setSelect(0)}
        />
        <div className="flex flex-col justify-between items-center w-[600px] h-full p-4">
          <div className="flex flex-col items-center gap-12 w-7/12">
            <div className="flex flex-col gap-3">
              <Typography className="font-poppins font-bold text-2xl text-[#262626] text-center">
                Choose your Avatar
              </Typography>
              <Typography className="font-poppins font-bold text-sm text-[#7C7C7C] text-center">
                Select an avatar that describes yourself!
              </Typography>
            </div>
            <Avatar src={selected} className="w-[148px] h-[148px]" />
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-6 px-7">
                <div className="flex gap-3 px-2">
                  <Button
                    onClick={() => {
                      setGender('male');
                    }}
                    className={`rounded-full capitalize font-poppins font-bold text-base ${
                      gender === 'male'
                        ? 'text-white bg-[#3AC4A0]'
                        : 'text-[#7C7C7C] bg-white'
                    } w-full py-1`}
                  >
                    Male
                  </Button>
                  <Button
                    onClick={() => {
                      setGender('female');
                    }}
                    className={`rounded-full capitalize font-poppins font-bold text-base ${
                      gender === 'female'
                        ? 'text-white bg-[#3AC4A0]'
                        : 'text-[#7C7C7C] bg-white'
                    } w-full py-1`}
                  >
                    Female
                  </Button>
                </div>
                <div
                  className={`flex flex-wrap gap-5 justify-center ${
                    avatars.length > 8 ? 'h-[288px]' : ''
                  } overflow-auto`}
                >
                  {avatars?.map((value, index) => {
                    return (
                      <Avatar
                        src={value}
                        alt="avatar"
                        key={index}
                        onClick={() => {
                          setSelected(value);
                        }}
                        className={`${
                          selected === value ? 'border-2 border-[#3AC4A0]' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
              <Button
                className="bg-[#3AC4A0] rounded-full w-full capitalize"
                onClick={() => {
                  handleAvatar(selected);
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SectionAvatar;
