import { SearchCircle } from '@/components/forms/searchCircle';
import { getUserFriends } from '@/repository/user.repository';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/solid';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UserFriends {
  id: string;
  name: string;
  avatar: string;
  username: string;
}

const initialFilter = {
  page: 1,
  limit: 10,
  search: ''
};

const MembershipPage = ({
  formRequest,
  changeStep,
  change,
  removeMember,
  submit,
  isLoadingSubmit
}: any): JSX.Element => {
  const [filter, setFilter] = useState(initialFilter);
  const [isLoading, setIsLoading] = useState(false);
  const [userFriends, setUserFriends] = useState<UserFriends[]>();
  const { t } = useTranslation();

  const handleChangeFilter = (event: any): void => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFilter(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchUserFriends = async (): Promise<void> => {
    try {
      setIsLoading(true);
      getUserFriends(filter)
        .then(res => {
          setUserFriends(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  useEffect(() => {
    fetchUserFriends()
      .then()
      .catch(() => {});
  }, [filter.search]);

  const handleFound = (id: string): string => {
    const data = formRequest.memberships.find(function (member: any) {
      return member.id === id;
    });

    return data;
  };
  return (
    <div className="mx-3 md:mx-8">
      {formRequest !== undefined && (
        <>
          <div className="mb-4">
            <div className="flex flex-row">
              <button
                className="w-1/3 items-start text-left transition-colors rounded-md hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:bg-gray-200"
                onClick={() =>
                  changeStep(
                    formRequest.membership_type === 'free'
                      ? ''
                      : 'membership_fee'
                  )
                }
              >
                <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
              </button>
              <Typography className="mb-2 text-center text-base font-poppins font-semibold">
                {t('circle.settingMember.title')}
              </Typography>
            </div>
            <Typography className="mb-4 text-center text-sm font-poppins font-normal text-[#7C7C7C]">
              {t('circle.settingMember.subtitle')}
            </Typography>
          </div>
          {isLoadingSubmit === true ? (
            <Typography className="text-center">Loading....</Typography>
          ) : (
            <div className="flex flex-row mb-5">
              {formRequest.memberships.length !== 0
                ? formRequest.memberships.map((data: any, idx: number) => {
                    return (
                      <div
                        className="flex items-center justify-center mr-5"
                        key={idx}
                      >
                        <div className="relative flex flex-col items-center justify-center">
                          <Avatar
                            size="md"
                            variant="circular"
                            src={data.avatar}
                            alt="Avatar"
                            className="mb-2"
                          />
                          <XCircleIcon
                            className="w-6 h-6 z-10 absolute transform top-5 text-[#3AC4A0] border-white translate-x-1/2 translate-y-1/2"
                            onClick={() => removeMember(idx)}
                          />
                          <Typography className="font-normal text-sm text-[#7C7C7C]">
                            {data.name}
                          </Typography>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          )}
          <SearchCircle
            name="search"
            type="outline"
            prefix={<MagnifyingGlassIcon className="w-5 h-5 text-[#262626]" />}
            onChange={e => {
              handleChangeFilter(e);
            }}
            placeholder="Search"
            value={filter.search}
          />

          {!isLoading ? (
            userFriends?.length !== 0 ? (
              userFriends?.map((data, idx) => (
                <Card
                  color="white"
                  shadow={false}
                  className="w-full my-3"
                  key={idx}
                >
                  <CardBody className="p-3 inline-block h-auto">
                    <div className="flex flex-row">
                      <Avatar
                        size="md"
                        variant="circular"
                        src={data.avatar}
                        alt="tania andrew"
                      />
                      <div className="flex w-full ml-5 flex-col gap-0.5">
                        <Typography className="font-semibold text-base text-[#262626]">
                          {data.name}
                        </Typography>
                        <Typography className="font-normal text-sm text-[#7C7C7C]">
                          @{data.username}
                        </Typography>
                      </div>
                      <div className="items-end">
                        {handleFound(data.id) !== undefined ? (
                          <Button
                            className="bg-[#DCFCE4] text-[#3AC4A0] rounded-full shadow-none"
                            name="memberships"
                            value={data.id}
                            disabled={false}
                          >
                            Member
                          </Button>
                        ) : (
                          <Button
                            className="bg-[#DCFCE4] text-[#3AC4A0] rounded-full shadow-none"
                            name="memberships"
                            value={JSON.stringify(data)}
                            onClick={change}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card color="white" shadow={false} className="w-full mb-3">
                <CardBody className="p-3 inline-block h-auto">
                  <Typography className="font-semibold text-base text-center text-[#262626]">
                    Data Not Found
                  </Typography>
                </CardBody>
              </Card>
            )
          ) : (
            <Card color="white" shadow={false} className="w-full mb-3">
              <CardBody className="p-3 inline-block h-auto">
                <Typography className="font-semibold text-center text-base text-[#262626]">
                  Loading...
                </Typography>
              </CardBody>
            </Card>
          )}
          {isLoadingSubmit === true ? (
            <Button
              className="w-full bg-seeds-button-green mt-10 rounded-full capitalize"
              onClick={submit}
              disabled={true}
            >
              Loading...
            </Button>
          ) : (
            <Button
              className="w-full bg-seeds-button-green mt-10 rounded-full capitalize"
              onClick={submit}
              disabled={false}
            >
              {t('circle.settingMember.button')}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default MembershipPage;
