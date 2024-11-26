import CCard from '@/components/CCard';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import CircleMember from '@/containers/circle/[id]/CircleMember';
import withAuth from '@/helpers/withAuth';
import { getUnjoinedUsers } from '@/repository/circleDetail.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
interface MemberDTO {
  id: string;
  name: string;
  avatar: string;
  username: string;
  status: string;
}

const AddCircleMember: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const circleId: string | any = router.query.circleId;
  const [searchMember, setSearchMember] = useState<string>('');
  const [unJoinedUser, setUnJoinedUsers] = useState<MemberDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState();
  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): any => {
    const { value } = event.target;
    setSearchMember(value);
  };

  const newData = Array.isArray(unJoinedUser)
    ? unJoinedUser.filter(el => {
        if (searchMember === '') return true;
        return el.name.toLowerCase().includes(searchMember.toLowerCase());
      })
    : [];

  const fetchUnJoinedUsers = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getUnjoinedUsers({ circleId });
      setUnJoinedUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchUnJoinedUsers();
  }, []);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const myData = await getUserInfo();
        setUserInfo(myData);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  return (
    <PageGradient defaultGradient className="w-full">
      {isLoading && <Loading />}
      <CCard className="flex flec-col p-4 md:p-5 mt-5 md:rounded-lg border-none rounded-none">
        <div className="flex justify-start md:justify-center">
          <Typography className="font-semibold font-poppins text-[#262626]">
            {t('circle.settingMember.add')}
          </Typography>
        </div>
        <div className="flex justify-start md:justify-center mt-1">
          <Typography className="font-normal text-sm font-poppins text-[#7C7C7C] text-center">
            {t('circle.settingMember.subtitle')}
          </Typography>
        </div>
        <div className="flex justify-start mt-4">
          <div className="flex justify-center flex-col absolute right-8 pt-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clipPath="url(#clip0_1980_32114)">
                <path
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                  fill="#323232"
                />
              </g>
              <defs>
                <clipPath id="clip0_1980_32114">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <input
            type="text"
            value={searchMember}
            onChange={handleFormChange}
            className="h-10 pr-10 p-6 focus:outline-none focus:outline focus:outline-seeds-green placeholder:text-neutral-soft rounded-full w-full border border-neutral-ultrasoft"
            placeholder="Search"
          />
        </div>
        <div className="flex flex-col gap-4 mt-4 overflow-auto">
          {newData.map((el: MemberDTO, idx: number) => {
            return (
              <CircleMember
                member={el}
                key={idx}
                userInfo={userInfo}
                setData={setUnJoinedUsers}
              />
            );
          })}
        </div>
      </CCard>
    </PageGradient>
  );
};

export default withAuth(AddCircleMember);
