import { inviteUserMembership } from '@/repository/circleDetail.repository';
import { Avatar, Button, Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
interface MemberDTO {
  id: string;
  name: string;
  avatar: string;
  username: string;
  status: string;
}

interface props {
  member: MemberDTO;
  userInfo: any;
  setData: any;
}

const CircleMember: React.FC<props> = ({ member, userInfo, setData }) => {
  const router = useRouter();
  const circleId: string | any = router.query.circleId;
  const inviteUser = async (): Promise<void> => {
    try {
      const response = await inviteUserMembership(
        circleId,
        member.id,
        userInfo.id
      );
      if (response.status === 200) {
        setData((prevState: MemberDTO[]) => {
          if (prevState !== null) {
            if (Array.isArray(prevState)) {
              const newData = prevState.map((el: MemberDTO) => {
                if (el.id === member.id) {
                  el.status = 'pending';
                }
                return el;
              });
              return newData;
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-between md:px-4">
      <div className="flex items-center gap-2">
        <Avatar
          alt="circleAvatar"
          className="w-16 h-16 bg-cover"
          src={member.avatar}
        />
        <div className="flex flex-col">
          <Typography className="font-semibold font-poppins">
            {member?.name}
          </Typography>
          <Typography className="font-normal text-sm font-poppins text-[#7C7C7C]">
            {member?.username}
          </Typography>
        </div>
      </div>
      <div className="flex items-center">
        {member.status.length === 0 && (
          <Button
            variant="filled"
            onClick={() => {
              inviteUser().catch(err => {
                console.log(err);
              });
            }}
            className="bg-[#DCFCE4] font-poppins text-xs font-semibold p-3 text-[#3AC4A0] shadow-none rounded-full normal-case"
          >
            Add
          </Button>
        )}
        {member.status.length > 0 && (
          <Button
            variant="filled"
            className={`${
              member.status === 'pending' ? 'bg-[#BDBDBD]' : 'bg-[#DCFCE4]'
            } font-poppins text-xs font-semibold p-3 ${
              member.status === 'pending' ? 'text-[#7C7C7C]' : 'text-[#3AC4A0]'
            } shadow-none rounded-full normal-case`}
          >
            {member.status}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CircleMember;
