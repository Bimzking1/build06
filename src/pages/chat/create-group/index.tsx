import back_nav from '@/assets/circle-page/back_nav.svg';
import CCard from '@/components/CCard';
import CreateGroupPopUp from '@/components/chat/PopUpCreateGroup';
import UserList from '@/components/chat/UserList';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { searchUser } from '@/repository/auth.repository';
import { createGroup } from '@/repository/chat.repository';
import { UseUploadMedia } from '@/repository/circleDetail.repository';
import {
  type CreateGroupForm,
  type SearchUserChat
} from '@/utils/interfaces/chat.interface';
import { type SearchUserParams } from '@/utils/interfaces/user.interface';
import {
  Button,
  ButtonGroup,
  Input,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { newGroup, wave } from 'public/assets/chat';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const initialSearchUserFilter: SearchUserParams = {
  page: 1,
  limit: 5,
  search: ''
};
const initialForm: CreateGroupForm = {
  name: '',
  desc: '',
  hashtag: []
};

const CreateGroup: React.FC = () => {
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState<SearchUserParams>(
    initialSearchUserFilter
  );
  const [searchUserList, setSearchUserList] = useState<SearchUserChat[] | []>(
    []
  );
  const [selectedUserList, setSelectedUserList] = useState<
    SearchUserChat[] | []
  >([]);
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(1);
  const [avatarPath, setAvatarPath] = useState<string>('');
  const [isShowConfirmation, setIsShowConfirmation] = useState<boolean>(false);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const [privacy, setPrivacy] = useState<string>('public');
  const [form, setForm] = useState<CreateGroupForm>(initialForm);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchFilter(prevFilter => ({
      ...prevFilter,
      search: event.target.value
    }));
  };

  const fetchUserList = useCallback(async (): Promise<void> => {
    if (searchFilter.search === '') {
      return;
    }
    try {
      const response = await searchUser(searchFilter);
      if (response !== null) {
        setSearchUserList(response.result);
      }
    } catch (error: any) {
      toast('Oops! Error when try to search user');
    }
  }, [searchFilter]);

  const createGroupChat = async (): Promise<void> => {
    if ((form.name === '', form.desc === '')) {
      toast('Please fill all fields');
      return;
    }
    try {
      const members = selectedUserList.map(user => user.id);
      const groupData = await createGroup({
        avatar: avatarPath,
        name: form.name,
        description: form.desc,
        privacy,
        hashtag: form.hashtag.filter(item => item !== ''),
        memberships: members
      });
      await router.push(`/chat?roomId=${groupData.id}`);
    } catch (error: any) {
      toast('Oops! Error when try to Leave Community');
    } finally {
      setIsShowConfirmation(false);
    }
  };

  const postMedia = async (mediaFile: File): Promise<string | undefined> => {
    try {
      const { data } = await UseUploadMedia(mediaFile);
      return data?.path as string;
    } catch (error: any) {
      toast('error uploading file');
    }
  };

  const handleUploadImage = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const fileMedia = event.target.files?.[0];
    const validation =
      fileMedia?.type !== 'image/jpg' &&
      fileMedia?.type !== 'image/jpeg' &&
      fileMedia?.type !== 'image/heic' &&
      fileMedia?.type !== 'image/heif' &&
      fileMedia?.type !== 'image/png';
    const maxFileMediaSize = 5;
    const sizeFileOnMB: number | undefined =
      fileMedia != null
        ? parseFloat((fileMedia.size / 1024 / 1024).toFixed(20))
        : undefined;

    if (validation) {
      toast(`${t('social.errorState.image2')}`);
    }
    if ((sizeFileOnMB as number) > maxFileMediaSize) {
      toast(`${t('social.errorState.image1')}`);
    } else {
      const mediaUrl = (await postMedia(fileMedia as File)) as string;
      setAvatarPath(mediaUrl);
    }
  };

  const addUserToSelectedList = (user: SearchUserChat): void => {
    const isUserInList = selectedUserList.some(
      selectedUser => selectedUser.id === user.id
    );

    if (!isUserInList) {
      setSelectedUserList(prevList => [...prevList, user]);
    }
  };

  const removeUserFromSelectedList = (userId: string): void => {
    const updatedList = selectedUserList.filter(user => user.id !== userId);

    setSelectedUserList(updatedList);
  };

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const tagInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputHashtagChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    const lastCharacterIsSpace = /\s$/.test(value);
    if (lastCharacterIsSpace && value.trim() !== '') {
      const newTag = value.trim();
      if (form.hashtag.includes(newTag)) {
        event.target.value = '';
      } else {
        setForm({
          ...form,
          hashtag: [...form.hashtag, newTag]
        });
        event.target.value = '';
      }
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (
      event.key === 'Backspace' &&
      event.currentTarget.value === '' &&
      form.hashtag.length > 0
    ) {
      const newHashtag = [...form.hashtag];
      newHashtag.pop(); // Remove the last tag
      setForm({
        ...form,
        hashtag: newHashtag
      });
    }
  };

  useEffect(() => {
    void fetchUserList();
  }, [fetchUserList, searchFilter]);

  useEffect(() => {
    const container = containerRef.current;
    if (container != null) {
      setIsScrollable(container.scrollWidth > container.clientWidth);
    }
  }, [selectedUserList]);

  return (
    <PageGradient
      defaultGradient
      className="z-0 sm:relative absolute overflow-hidden flex flex-col items-center w-full bottom-0"
    >
      {isShowConfirmation && (
        <CreateGroupPopUp
          onClose={() => {
            setIsShowConfirmation(false);
          }}
          onClick={createGroupChat}
        />
      )}
      <CCard className="flex flex-row justify-center border-none rounded-xl bg-[#E9E9E9]/50 w-full px-4 gap-4 !font-poppins">
        <div className="lg:w-[600px] bg-white min-h-96 flex flex-col p-4">
          {step === 1 ? (
            <>
              <div className="w-full flex gap-8 border-b border-[#E9E9E9]">
                <div
                  onClick={() => {
                    void router.push('/chat');
                  }}
                >
                  <Image
                    alt="Back"
                    src={back_nav}
                    className="h-6 w-6 object-cover"
                  />
                </div>
                <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                  {t('chat.newGroup')}
                </Typography>
              </div>
              <div
                className={`flex gap-2 my-4 w-full ${
                  isScrollable ? 'overflow-x-scroll' : ''
                }`}
                ref={containerRef}
              >
                {selectedUserList.map((user, index) => (
                  <div
                    className="flex flex-col gap-1 w-14 flex-shrink-0"
                    key={index}
                  >
                    <div className="relative">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={56}
                        height={56}
                        className="size-14 rounded-full overflow-hidden"
                      />
                      <div
                        onClick={() => {
                          removeUserFromSelectedList(user.id);
                        }}
                        className="absolute bottom-0 right-0 size-[22px] rounded-full overflow-hidden bg-[#3AC4A0] flex items-center justify-center border border-white"
                      >
                        <svg
                          width="11"
                          height="10"
                          viewBox="0 0 11 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.54851 4.98435L9.7723 1.79186L10.4296 1.13459C10.5235 1.04069 10.5235 0.884194 10.4296 0.758998L9.741 0.0704225C9.61581 -0.0234742 9.45931 -0.0234742 9.36541 0.0704225L5.51565 3.95149L1.63459 0.0704225C1.54069 -0.0234742 1.38419 -0.0234742 1.259 0.0704225L0.570423 0.758998C0.476526 0.884194 0.476526 1.04069 0.570423 1.13459L4.45149 4.98435L0.570423 8.86541C0.476526 8.95931 0.476526 9.11581 0.570423 9.241L1.259 9.92958C1.38419 10.0235 1.54069 10.0235 1.63459 9.92958L5.51565 6.04851L8.70814 9.2723L9.36541 9.92958C9.45931 10.0235 9.61581 10.0235 9.741 9.92958L10.4296 9.241C10.5235 9.11581 10.5235 8.95931 10.4296 8.86541L6.54851 4.98435Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                      {user.name}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col border border-1 border-[#7C7C7C] rounded-full px-4 gap-3 justify-between">
                <div className="flex w-full">
                  <input
                    type="text"
                    value={searchFilter.search}
                    onChange={handleInputChange}
                    className="focus:outline-none placeholder:text-[#7C7C7C] w-full text-sm font-normal py-3 px-4 rounded-full"
                    placeholder="Search"
                  />
                  <div className="flex mx-2 mt-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_6749_1443)">
                        <path
                          d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                          fill="#262626"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6749_1443">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                {searchUserList?.map((user, index) => (
                  <UserList
                    data={user}
                    addToList={addUserToSelectedList}
                    key={index}
                  />
                ))}
              </div>
              <div
                onClick={() => {
                  if (selectedUserList?.length > 0) {
                    setStep(2);
                  }
                }}
                className="bg-[#3AC4A0] mt-5 w-full rounded-full hover:scale-105 transition ease-out"
              >
                <Typography className="text-white text-lg font-bold text-center p-2">
                  {t('chat.next')}
                </Typography>
              </div>
            </>
          ) : (
            <div>
              <div className="w-full flex gap-8 border-b border-[#E9E9E9]">
                <div
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  <Image
                    alt="Back"
                    src={back_nav}
                    className="h-6 w-6 object-cover"
                  />
                </div>
                <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                  {t('chat.newGroup')}
                </Typography>
              </div>
              <div className="w-full py-4 flex flex-col gap-4 justify-center items-center bg-[#DCFCE4] relative rounded-lg overflow-hidden my-4">
                <div className="w-full absolute bottom-0 left-0">
                  <Image
                    src={wave}
                    alt="bg wave"
                    width={500}
                    height={132}
                    className="w-full"
                  />
                </div>
                <input
                  type="file"
                  id="MediaUpload"
                  onChange={handleUploadImage}
                  className="absolute inset-0 opacity-0"
                  accept="image/jpg,image/jpeg,image/png,video/mp4,video/mov"
                />
                <Image
                  src={avatarPath === '' ? newGroup : avatarPath}
                  width={100}
                  height={100}
                  alt="Group Image"
                  className="rounded-full"
                />
              </div>
              <div className="w-full flex flex-col my-8">
                <Input
                  variant="static"
                  label={t('chat.groupName') ?? ''}
                  placeholder={t('chat.enterGroupName') ?? ''}
                  value={form.name}
                  name="name"
                  onChange={handleFormInputChange}
                  labelProps={{
                    className:
                      '!text-base !text-[#262626] !font-semibold !font-poppins'
                  }}
                  className="placeholder:text-[#7C7C7C] font-thin"
                />
                <Typography className="text-[#7C7C7C] !font-poppins text-[14px] font-semibold my-4 w-full border-b border-[#E9E9E9] pb-2">
                  Detail Group
                </Typography>
                <Input
                  variant="static"
                  label={t('chat.description') ?? ''}
                  placeholder={t('chat.enterGroupDescription') ?? ''}
                  value={form.desc}
                  name="desc"
                  onChange={handleFormInputChange}
                  labelProps={{
                    className:
                      '!text-base !text-[#262626] !font-semibold !font-poppins'
                  }}
                  className="placeholder:text-[#7C7C7C] font-thin"
                />
                <Typography className="text-[#262626] !font-poppins text-base font-semibold mt-4 mb-2 w-full">
                  {t('chat.typeGroup')}
                </Typography>
                <ButtonGroup className="mb-8">
                  <Button
                    className={`shadow-none border font-thin capitalize border-[#BDBDBD] ${
                      privacy === 'public'
                        ? 'bg-[#3AC4A0]'
                        : 'bg-white text-[#7C7C7C]'
                    }`}
                    onClick={() => {
                      setPrivacy('public');
                    }}
                  >
                    {t('chat.public')}
                  </Button>
                  <Button
                    className={`shadow-none border font-thin capitalize !border-[#BDBDBD] ${
                      privacy === 'private'
                        ? 'bg-[#3AC4A0]'
                        : 'bg-white text-[#7C7C7C]'
                    }`}
                    onClick={() => {
                      setPrivacy('private');
                    }}
                  >
                    {t('chat.private')}
                  </Button>
                </ButtonGroup>
                <Typography className="text-[#262626] !font-poppins font-semibold mt-4 w-full">
                  Hashtag
                </Typography>
                <div className="flex w-full border-b border-[#BDBDBD]">
                  <div className="flex flex-wrap mt-2">
                    {form.hashtag.map((tag, index) => (
                      <div
                        key={index}
                        className="bg-[#DCE1FE] text-[#3C49D6] rounded-md px-3 py-1 text-sm mr-2 mb-2"
                      >
                        <span>#{tag}</span>
                      </div>
                    ))}
                  </div>
                  <input
                    ref={tagInputRef}
                    className="flex flex-wrap outline-0 min-w-[100px] text-blue-gray-700 font-sans font-thin mt-2"
                    contentEditable="true"
                    onChange={handleInputHashtagChange}
                    onKeyDown={handleKeyDown}
                    style={{ minHeight: '40px' }}
                  />
                </div>

                <div
                  onClick={() => {
                    setIsShowConfirmation(true);
                  }}
                  className="bg-[#3AC4A0] mt-8 w-full rounded-full hover:scale-105 transition ease-out"
                >
                  <Typography className="text-white text-lg font-bold text-center p-2">
                    {t('chat.next')}
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </div>
      </CCard>
    </PageGradient>
  );
};

export default withAuth(CreateGroup);
