/* eslint-disable @next/next/no-img-element */
import back_nav from '@/assets/circle-page/back_nav.svg';
import more_vertical from '@/assets/more-option/more_vertical.svg';
import CCard from '@/components/CCard';
import MediaItem from '@/components/chat/MediaItem';
import ModalNewChat from '@/components/chat/ModalNewChat';
import MutePopUp from '@/components/chat/MutePopup';
import DeleteChatPopUp from '@/components/chat/PopUpDelete';
import LeaveCommunityPopUp from '@/components/chat/PopUpLeave';
import SearchChatPopup from '@/components/chat/SearchPopup';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { ChatVoiceRecorder } from '@/containers/chat/ChatVoiceRecording';
import ContactList from '@/containers/chat/ContactList';
import GifChat from '@/containers/chat/GifChat';
import withAuth from '@/helpers/withAuth';
import useGetOnlineStatus from '@/hooks/useGetOnlineStatus';
import { searchUser } from '@/repository/auth.repository';
import {
  acceptRequest,
  deleteGroupChat,
  deletePersonalChat,
  getChat,
  getChatLinks,
  getChatMedia,
  getChatNotes,
  getGroupDetail,
  getGroupMember,
  getListChat,
  getPersonalChatCommonGroups,
  leaveGroupChat,
  muteGroupChat,
  mutePersonalChat,
  readGroupMessage,
  readPersonalMessage,
  rejectRequest,
  sendPersonalMessage
} from '@/repository/chat.repository';
import { UseUploadMedia } from '@/repository/circleDetail.repository';
import { getOtherUser } from '@/repository/profile.repository';
import socketService from '@/repository/socket.repository';
import { useAppSelector } from '@/store/redux/store';
import type {
  Chat,
  CommonGroupData,
  GetListChatParams,
  GroupMemberData,
  IChatBubble,
  IGroupChatDetail,
  PersonalChatMediaData,
  PersonalChatNotesData,
  SearchUserChat
} from '@/utils/interfaces/chat.interface';
import type {
  IOtherUserProfile,
  SearchUserParams
} from '@/utils/interfaces/user.interface';
import {
  Button,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  camera,
  chatEmpty,
  chatIcon1,
  dropdownGreen,
  galleryChat,
  mic,
  seedsChat,
  seedyChatCommunty,
  seedyChatNotSelected,
  seedyChatPersonal,
  sendChat,
  threedotsVertical
} from 'public/assets/chat';
import { XIcon } from 'public/assets/vector';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface TabTypes {
  id: number;
  name: string;
  value: 'PERSONAL' | 'COMMUNITY' | 'REQUEST';
  handler: () => void;
}

const initialFilter: GetListChatParams = {
  page: 1,
  limit: 10,
  type: 'PERSONAL',
  search: '',
  unread: false
};

const initialSearchUserFilter: SearchUserParams = {
  page: 1,
  limit: 5,
  search: ''
};

const ChatPages: React.FC = () => {
  const router = useRouter();
  const { dataUser } = useAppSelector(state => state.user);
  const { roomId } = router.query;
  const [chatList, setChatList] = useState<Chat[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const [isShowSeeMore, setIsShowSeeMore] = useState<boolean>(false);
  const [detailType, setDetailType] = useState<string>('media');
  // const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<GetListChatParams>(initialFilter);
  const [otherUserData, setOtherUserData] = useState<IOtherUserProfile | null>(
    null
  );
  const [groupData, setgroupData] = useState<IGroupChatDetail | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [isNewPopupOpen, setIsNewPopupOpen] = useState(false);
  const [isMutePopupOpen, setIsMutePopupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLeavePopupOpen, setIsLeavePopupOpen] = useState<boolean>(false);
  const [isShowGifPopup, setIsShowGifPopup] = useState<boolean>(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<IChatBubble[] | []>([]);
  const [message, setMessage] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<SearchUserParams>(
    initialSearchUserFilter
  );
  const [sarchUserList, setSearchUserList] = useState<SearchUserChat[] | []>(
    []
  );
  const [searchText, setSearchText] = useState<string>('');
  const [limit, setLimit] = useState<number>(20);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [personalMediaData, setPersonalMediaData] = useState<
    PersonalChatMediaData[] | []
  >([]);

  const [personalNotesData, setPersonalNotesData] = useState<
    PersonalChatNotesData[] | []
  >([]);

  const [personalLinksData, setPersonalLinksData] = useState<
    PersonalChatMediaData[] | []
  >([]);

  const [commonGroupData, setCommonGroupData] = useState<
    CommonGroupData[] | []
  >([]);
  const [audio, setAudio] = useState<File | null>(null);

  const isOnline = useGetOnlineStatus(roomId as string);

  const [groupMember, setGroupMember] = useState<GroupMemberData[] | []>([]);

  const [activeTab, setActiveTab] = useState<
    'PERSONAL' | 'COMMUNITY' | 'REQUEST'
  >('PERSONAL');
  const { t } = useTranslation();

  const handleChangeTab = (
    value: 'PERSONAL' | 'COMMUNITY' | 'REQUEST'
  ): void => {
    if (activeTab !== value) {
      setIsChatActive(false);
      setActiveTab(value);
      setChatList([]);
      // setHasMore(true);
      setFilter(prevState => ({
        ...prevState,
        type: value,
        page: 1
      }));
    }
  };

  const handleListClick = (): void => {
    setIsDropdownOpen(false);
    setIsChatActive(true);
  };
  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { value } = event.target;
    setMessage(value);
  };

  const handleSendMessage = async (): Promise<void> => {
    const data =
      activeTab === 'COMMUNITY'
        ? { content_text: message, group_id: roomId as string }
        : { content_text: message, user_id: roomId as string };
    try {
      if (message !== '') {
        await sendPersonalMessage(data);
        void fetchChat();
        setMessage('');
      }
    } catch (error: any) {
      toast(error, { type: 'error' });
    }
  };

  const handleSendGifMessage = async (mediaUrl: string): Promise<void> => {
    const data =
      activeTab === 'COMMUNITY'
        ? { media_urls: [mediaUrl], group_id: roomId as string }
        : { media_urls: [mediaUrl], user_id: roomId as string };
    try {
      await sendPersonalMessage(data);
      void fetchChat();
    } catch (error: any) {
      toast(error, { type: 'error' });
    }
  };

  const handleSearchInputChange = (value: string): void => {
    setSearchFilter(prevFilter => ({
      ...prevFilter, // Keep the previous state values
      search: value // Update only the search property
    }));
  };

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    setSearchText(value);
  };

  const handleFilterUnreadChange = (): void => {
    setFilter((prevState: GetListChatParams) => ({
      ...prevState,
      unread: !filter.unread
    }));
  };
  const dataTab = useMemo<TabTypes[]>(
    () => [
      {
        id: 1,
        name: t('chat.personal'),
        value: 'PERSONAL',
        handler: () => {
          handleChangeTab(dataTab[0].value);
        }
      },
      {
        id: 2,
        name: t('chat.community'),
        value: 'COMMUNITY',
        handler: () => {
          handleChangeTab(dataTab[1].value);
        }
      },
      {
        id: 3,
        name: t('chat.request'),
        value: 'REQUEST',
        handler: () => {
          handleChangeTab(dataTab[2].value);
        }
      }
    ],
    [handleChangeTab, t]
  );

  const handleToggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
    // setSelectedChatId(chatId);
    setIsSearchActive(false);
  };
  const handleDropdownOptionClick = (option: string): void => {
    switch (option) {
      case 'Search':
        setIsSearchActive(true);
        break;
      case 'Delete':
        setIsDeletePopupOpen(true);
        break;
      case 'Mute':
        setIsMutePopupOpen(true);
        break;
      case 'New':
        setIsNewPopupOpen(true);
        break;
      case 'Leave':
        setIsLeavePopupOpen(true);
        break;
      case 'Gif':
        setIsShowGifPopup(true);
        break;

      default:
    }
  };

  const fetchListChat = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getListChat(filter);
      setChatList(response.data);
    } catch (error: any) {
      toast(error, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChat = useCallback(
    async (isRefetch: boolean = true): Promise<void> => {
      try {
        setIsLoading(true);
        if (activeTab === 'PERSONAL') {
          const response = await getChat({ user_id: roomId as string, limit });
          setMessageList(response.data);
          await readPersonalMessage(roomId as string);
        } else if (activeTab === 'COMMUNITY') {
          const response = await getChat({ group_id: roomId as string, limit });
          setMessageList(response.data);
          await readGroupMessage(roomId as string);
        }
      } catch (error: any) {
        toast('Oops! Error when try to get chat');
      } finally {
        setIsLoading(false);
        if (containerRef.current != null && isRefetch) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }
    },
    [activeTab, containerRef, limit, roomId, setIsLoading]
  );

  useEffect(() => {
    const handleScrollEvent = (): void => {
      if (containerRef?.current?.scrollTop === 0) {
        setLimit(limit + 10);
        void fetchChat(false);
      }
    };

    containerRef?.current?.addEventListener('scroll', handleScrollEvent);
  }, [fetchChat, limit]);

  const muteChat = async (type: string): Promise<void> => {
    try {
      activeTab === 'PERSONAL'
        ? await mutePersonalChat({ user_id: roomId as string, type })
        : await muteGroupChat({ group_id: roomId as string, type });
    } catch (error: any) {
      toast('Oops! Error when try to mute chat');
    } finally {
      setIsMutePopupOpen(false);
    }
  };

  const deleteChat = async (): Promise<void> => {
    try {
      activeTab === 'PERSONAL'
        ? await deletePersonalChat(roomId as string)
        : await deleteGroupChat(roomId as string);
    } catch (error: any) {
      toast('Oops! Error when try to delete chat');
    } finally {
      setIsDeletePopupOpen(false);
      await fetchChat();
      await router.push('/chat');
    }
  };

  const acceptRequestChat = async (): Promise<void> => {
    try {
      await acceptRequest(roomId as string);
    } catch (error: any) {
      toast('Oops! Error when try to accept request');
    }
  };

  const rejectRequestChat = async (): Promise<void> => {
    try {
      await rejectRequest(roomId as string);
    } catch (error: any) {
      toast('Oops! Error when try to reject request');
    }
  };

  const leaveCommunity = async (message: string): Promise<void> => {
    try {
      await leaveGroupChat({
        id: roomId as string,
        user_id: dataUser.id,
        message_text: message
      });
      await router.push('/chat');
    } catch (error: any) {
      toast('Oops! Error when try to Leave Community');
    } finally {
      setIsDeletePopupOpen(false);
    }
  };

  const fetchUserNewChat = useCallback(async (): Promise<void> => {
    if (searchFilter.search === '') {
      return;
    }
    try {
      setIsLoading(true);
      const response = await searchUser(searchFilter);
      if (response !== null) {
        setSearchUserList(response.result);
      }
    } catch (error: any) {
      toast('Oops! Error when try to search user');
    } finally {
      setIsLoading(false);
    }
  }, [searchFilter]);

  useEffect(() => {
    void fetchListChat();
  }, [filter.search.length]);

  useEffect(() => {
    void fetchListChat();
  }, [filter]);

  useEffect(() => {
    void fetchUserNewChat();
  }, [fetchUserNewChat, searchFilter]);

  const fetchOtherUser = async (): Promise<void> => {
    try {
      const userData = await getOtherUser(roomId as string);
      setOtherUserData(userData);
    } catch (error: any) {
      toast(error, { type: 'error' });
      setOtherUserData(null);
    }
  };

  const fetchGroup = async (): Promise<void> => {
    try {
      const groupData = await getGroupDetail(roomId as string);
      setgroupData(groupData);
    } catch (error: any) {
      toast(error, { type: 'error' });
      setgroupData(null);
    }
  };

  const fetchNotes = async (): Promise<void> => {
    try {
      const personalNotes =
        activeTab === 'COMMUNITY'
          ? await getChatNotes({
              group_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            })
          : await getChatNotes({
              user_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            });
      setPersonalNotesData(personalNotes.data);
    } catch (error: any) {
      toast('Failed to fetch Notes');
      setPersonalNotesData([]);
    }
  };
  const fetchMedia = async (): Promise<void> => {
    try {
      const personalMedia =
        activeTab === 'COMMUNITY'
          ? await getChatMedia({
              group_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            })
          : await getChatMedia({
              user_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            });
      setPersonalMediaData(personalMedia.data);
    } catch (error: any) {
      toast('Failed to fetch Media');
      setPersonalMediaData([]);
    }
  };
  const fetchLink = async (): Promise<void> => {
    try {
      const personalLinks =
        activeTab === 'COMMUNITY'
          ? await getChatLinks({
              group_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            })
          : await getChatLinks({
              user_id: roomId as string,
              page: 1,
              limit: 3,
              type: activeTab
            });
      setPersonalLinksData(personalLinks.data);
    } catch (error: any) {
      toast('Failed to fetch Links');
      setPersonalLinksData([]);
    }
  };
  const fetchCommonGroup = async (): Promise<void> => {
    try {
      const commonGroup = await getPersonalChatCommonGroups({
        user_id: roomId as string,
        page: 1,
        limit: 3
      });
      setCommonGroupData(commonGroup.data);
    } catch (error: any) {
      toast('Failed to fetch Group list');
      setCommonGroupData([]);
    }
  };
  const fetchDetailPersonal = async (): Promise<void> => {
    void fetchNotes();
    void fetchMedia();
    void fetchLink();
    void fetchCommonGroup();
  };

  const fetchGroupMember = async (): Promise<void> => {
    try {
      const groupMember = await getGroupMember({
        id: roomId as string,
        page: 1,
        limit: 3
      });
      setGroupMember(groupMember.data);
    } catch (error: any) {
      toast('Failed to fetch Group Member');
      setGroupMember([]);
    }
  };

  const fetchDetailGroup = async (): Promise<void> => {
    void fetchNotes();
    void fetchMedia();
    void fetchLink();
    void fetchGroupMember();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setMessage(message + '\n');
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

  const handleSendVoiceMessage = async (mediaFile: File): Promise<void> => {
    const mediaUrl = (await postMedia(mediaFile)) as string;
    const data =
      activeTab === 'COMMUNITY'
        ? { media_urls: [mediaUrl], group_id: roomId as string }
        : { media_urls: [mediaUrl], user_id: roomId as string };
    try {
      await sendPersonalMessage(data);
      void fetchChat();
    } catch (error: any) {
      toast(error, { type: 'error' });
    }
  };

  const handleSendImageMessage = async (event: any): Promise<any> => {
    const fileMedia = event.target.files[0];
    const fileMediaEle = event.target;
    if (fileMedia?.type?.includes('video') === true) {
      const validation =
        fileMedia?.type !== 'video/mp4' && fileMedia?.type !== 'video/mov';
      const maxFileMediaSize = 20;
      const sizeFileOnMB: any = parseFloat(
        (fileMedia?.size / 1024 / 1024).toFixed(20)
      );
      if (validation) {
        fileMediaEle.value = null;
        // setIsError(true);
        toast(`${t('social.errorState.video1')}`);
        return new Error(
          'You can only insert image in JPG, JPEG, PNG, .HEIC, .HEIF. format.'
        );
      }
      if (sizeFileOnMB > maxFileMediaSize) {
        fileMediaEle.value = null;
        // setIsError(true);
        toast(`${t('social.errorState.video3')}`);
        return new Error('Your image is exceeding the 20MB size limit');
      } else {
        const mediaUrl = (await postMedia(fileMedia)) as string;
        const data =
          activeTab === 'COMMUNITY'
            ? { media_urls: [mediaUrl], group_id: roomId as string }
            : { media_urls: [mediaUrl], user_id: roomId as string };
        try {
          await sendPersonalMessage(data);
          void fetchChat();
        } catch (error: any) {
          toast(error, { type: 'error' });
        }
      }
    }
    if (fileMedia?.type?.includes('image') === true) {
      const validation =
        fileMedia?.type !== 'image/jpg' &&
        fileMedia?.type !== 'image/jpeg' &&
        fileMedia?.type !== 'image/heic' &&
        fileMedia?.type !== 'image/heif' &&
        fileMedia?.type !== 'image/png';
      const maxFileMediaSize = 5;
      const sizeFileOnMB: any = parseFloat(
        (fileMedia?.size / 1024 / 1024).toFixed(20)
      );

      if (validation) {
        fileMediaEle.value = null;

        toast(`${t('social.errorState.image2')}`);
        return new Error(
          'You can only insert image in JPG, JPEG, PNG, .HEIC, .HEIF. format.'
        );
      }
      if (sizeFileOnMB > maxFileMediaSize) {
        fileMediaEle.value = null;

        toast(`${t('social.errorState.image1')}`);
        return new Error('Your image is exceeding the 5MB size limit');
      } else {
        const mediaUrl = (await postMedia(fileMedia)) as string;
        const data =
          activeTab === 'COMMUNITY'
            ? { media_urls: [mediaUrl], group_id: roomId as string }
            : { media_urls: [mediaUrl], user_id: roomId as string };
        try {
          await sendPersonalMessage(data);
          void fetchChat();
        } catch (error: any) {
          toast(error, { type: 'error' });
        }
      }
    }
  };

  useEffect(() => {
    if (roomId === null) {
      return;
    }

    socketService.addListener(`chat.personal.${roomId as string}`, () => {
      void fetchChat(false);
    });

    return () => {};
  }, [roomId]);

  useEffect(() => {
    socketService.connect(dataUser.id);
    return () => {};
  }, []);

  useEffect(() => {
    if (roomId !== undefined) {
      if (activeTab === 'COMMUNITY') {
        void fetchGroup();
      } else {
        void fetchOtherUser();
      }
      void fetchChat();
    }
  }, [roomId]);

  const renderDetailChatItem = (): JSX.Element | undefined => {
    if (detailType === 'media') {
      return (
        <div className="w-full flex gap-4">
          {personalMediaData?.map((item: PersonalChatMediaData) => (
            <MediaItem key={item.id} message={item} />
          ))}
        </div>
      );
    }
    if (detailType === 'note') {
      return (
        <div className="w-full flex">
          {personalNotesData?.map((item: PersonalChatNotesData) => (
            <div key={item?.id}>
              <div className="flex gap-4">
                <Image
                  src={otherUserData?.avatar as string}
                  alt="Avatar"
                  width={30}
                  height={30}
                  className="rounded-full w-[30px] h-[30px]"
                />
                <div className="flex flex-col">
                  <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                    {otherUserData?.name}
                  </Typography>
                  <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                    {moment(item?.created_at).format('MM/DD/YY, HH:mm')}
                  </Typography>
                  <Typography className="text-mxl font-medium text-[#262626] font-poppins mb-2">
                    {item?.content_text}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (detailType === 'link') {
      return (
        <div className="w-full flex">
          {personalLinksData?.map((item: PersonalChatMediaData) => (
            <div key={item?.id}>
              <div className="flex gap-4">
                <Image
                  src={otherUserData?.avatar as string}
                  alt="Avatar"
                  width={30}
                  height={30}
                  className="rounded-full w-[30px] h-[30px]"
                />
                <div className="flex flex-col">
                  <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                    {otherUserData?.name}
                  </Typography>
                  <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                    {moment(item?.created_at).format('MM/DD/YYYY')}
                  </Typography>

                  <Typography
                    href={item?.content_text}
                    className="text-mxl underline font-medium text-[#262626] font-poppins mb-2"
                  >
                    {item?.content_text}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (detailType === 'participant') {
      return (
        <div className="w-full flex">
          {groupMember?.map((item: GroupMemberData, index: number) => (
            <div key={index} className="flex gap-4 w-1/3">
              <Image
                src={item?.user_avatar}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full w-12 h-12"
              />
              <div className="flex gap-2">
                <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                  {item?.user_name}
                </Typography>
                {item?.role === 'admin' && (
                  <div className="bg-[#DCFCE4] rounded-full p-1 h-6 flex-shrink-0">
                    <Typography className="text-xs text-[#3AC4A0] font-poppins">
                      Admin
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (detailType === 'groups') {
      return (
        <div className="w-full flex">
          {commonGroupData?.map((item: CommonGroupData) => (
            <div key={item?.id}>
              <div className="flex gap-4">
                <Image
                  src={item?.avatar}
                  alt="Avatar"
                  width={56}
                  height={56}
                  className="rounded-full w-14 h-14"
                />
                <div className="flex flex-col">
                  <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                    {item?.name}
                  </Typography>
                  <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                    {item?.top_members?.map(member => member.name).join(', ')}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <PageGradient defaultGradient className="w-full">
      {isDeletePopupOpen && (
        <DeleteChatPopUp
          onClose={() => {
            setIsDeletePopupOpen(false);
          }}
          onClick={deleteChat}
        />
      )}
      {isLeavePopupOpen && (
        <LeaveCommunityPopUp
          onClose={() => {
            setIsLeavePopupOpen(false);
          }}
          onClick={leaveCommunity}
        />
      )}
      {isSearchPopupOpen && (
        <SearchChatPopup
          onClose={() => {
            setIsSearchPopupOpen(false);
          }}
          onChange={handleSearchInputChange}
          value={searchFilter.search as string}
          userList={sarchUserList}
          onSelect={() => {
            setIsChatActive(true);
          }}
        />
      )}
      {isMutePopupOpen && (
        <MutePopUp
          onClose={() => {
            setIsMutePopupOpen(false);
          }}
          onMute={muteChat}
        />
      )}
      <ModalNewChat
        isOpen={isNewPopupOpen}
        handleOpen={() => {
          setIsNewPopupOpen(false);
        }}
        onPersonalClick={() => {
          setIsNewPopupOpen(false);
          setIsSearchPopupOpen(true);
        }}
        onGroupClick={() => {
          setIsNewPopupOpen(false);
          void router.push('/chat/create-group');
        }}
      />
      {isShowDetail ? (
        <CCard className="flex flex-col border-none rounded-xl bg-white w-full py-5 px-4 gap-4">
          {activeTab === 'COMMUNITY' ? (
            <>
              {isShowSeeMore ? (
                <>
                  <div className="flex justify-between items-center">
                    <div
                      onClick={() => {
                        setIsShowSeeMore(false);
                      }}
                    >
                      <Image
                        alt="Back"
                        src={back_nav}
                        className="h-6 w-6 object-cover"
                      />
                    </div>
                    <Image
                      src={more_vertical}
                      alt="threeDots"
                      className="cursor-pointer"
                    />
                  </div>
                  {renderDetailChatItem()}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div
                      onClick={() => {
                        setIsShowDetail(false);
                      }}
                    >
                      <Image
                        alt="Back"
                        src={back_nav}
                        className="h-6 w-6 object-cover"
                      />
                    </div>
                    <Image
                      src={more_vertical}
                      alt="threeDots"
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="w-full py-4 flex flex-col gap-4 justify-center items-center bg-[#DCFCE4]">
                    <img
                      src={groupData?.avatar}
                      alt="avatar"
                      className="rounded-full w-36 h-36 bg-[#3AC4A0]"
                    />
                    <div className="flex items-center gap-4">
                      <Typography className="text-md text-[#3AC4A0] font-poppins">
                        {groupData?.total_memberships} {t('chat.participants')}
                      </Typography>
                      <div className="size-2 bg-[#3AC4A0] rounded-full" />
                      <Typography className="text-md text-[#3AC4A0] font-poppins">
                        {groupData?.total_online} online
                      </Typography>
                    </div>
                  </div>
                  <div className="w-full flex flex-col p-4 gap-8">
                    <div>
                      <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                        {t('chat.description')}
                      </Typography>
                      <Typography className="text-md text-[#262626] font-poppins">
                        {groupData?.description}
                      </Typography>
                    </div>
                    <div>
                      <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                        {t('chat.typeGroup')}
                      </Typography>
                      <Typography className="text-md text-[#262626] font-poppins">
                        Detail
                      </Typography>
                    </div>
                    <div>
                      <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                        Hashtag
                      </Typography>
                      <div className="flex gap-4">
                        {groupData?.hashtags?.map(
                          (tag: string, index: number) => (
                            <div
                              key={index}
                              className="p-2 bg-[#DCE1FE] rounded-md"
                            >
                              <Typography className="text-md text-[#3C49D6]] font-poppins">
                                #{tag}
                              </Typography>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="w-full flex justify-between">
                        <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                          {t('chat.participants')}
                        </Typography>
                        <Typography
                          onClick={() => {
                            setDetailType('participant');
                            void fetchDetailGroup();
                            setIsShowSeeMore(true);
                          }}
                          className="text-md text-[#3AC4A0] font-poppins mb-2"
                        >
                          {t('chat.seeMore')}
                        </Typography>
                      </div>
                      <div className="flex flex-col gap-4">
                        {groupMember?.map(
                          (item: GroupMemberData, index: number) => (
                            <div key={index}>
                              <div className="flex gap-4">
                                <Image
                                  src={item?.user_avatar}
                                  alt="Avatar"
                                  width={48}
                                  height={48}
                                  className="rounded-full w-12 h-12"
                                />
                                <div className="flex gap-2">
                                  <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                                    {item?.user_name}
                                  </Typography>
                                  {item?.role === 'admin' && (
                                    <div className="bg-[#DCFCE4] rounded-full p-1 h-6 flex-shrink-0">
                                      <Typography className="text-xs text-[#3AC4A0] font-poppins">
                                        Admin
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="w-full border-b border-[#E9E9E9]">
                      <div className="w-full flex justify-between">
                        <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                          {t('chat.notes')}
                        </Typography>
                        <Typography
                          onClick={() => {
                            setDetailType('note');
                            void fetchDetailGroup();
                            setIsShowSeeMore(true);
                          }}
                          className="text-md text-[#3AC4A0] font-poppins mb-2"
                        >
                          {t('chat.seeMore')}
                        </Typography>
                      </div>

                      {personalNotesData?.map((item: PersonalChatNotesData) => (
                        <div key={item?.id}>
                          <div className="flex gap-4">
                            <Image
                              src={otherUserData?.avatar as string}
                              alt="Avatar"
                              width={30}
                              height={30}
                              className="rounded-full w-[30px] h-[30px]"
                            />
                            <div className="flex flex-col">
                              <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                                {otherUserData?.name}
                              </Typography>
                              <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                                {moment(item?.created_at).format(
                                  'MM/DD/YY, HH:mm'
                                )}
                              </Typography>
                              <Typography className="text-mxl font-medium text-[#262626] font-poppins mb-2">
                                {item?.content_text}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-between">
                        <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                          Media
                        </Typography>
                        <Typography
                          onClick={() => {
                            setDetailType('participants');
                            void fetchDetailGroup();
                            setIsShowSeeMore(true);
                          }}
                          className="text-md text-[#3AC4A0] font-poppins mb-2"
                        >
                          {t('chat.seeMore')}
                        </Typography>
                      </div>
                      <div className="w-full flex gap-4">
                        {personalMediaData?.map(
                          (item: PersonalChatMediaData) => {
                            if (item.media_url.includes('mp3')) {
                              return null;
                            }
                            if (
                              item.media_url.includes('mp4') ||
                              item.media_url.includes('mov')
                            ) {
                              return (
                                <div
                                  key={item.id}
                                  className="w-1/3 h-42 rounded-md"
                                >
                                  <video width="320" height="144" controls>
                                    <source
                                      src={item.media_url}
                                      type="video/mp4"
                                    />
                                  </video>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  key={item.id}
                                  className="w-1/3 h-36 rounded-md"
                                >
                                  <img
                                    src={item?.media_url}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              );
                            }
                          }
                        )}
                      </div>
                    </div>
                    <div className="w-full border-b border-[#E9E9E9]">
                      <div className="w-full flex justify-between">
                        <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                          {t('chat.links')}
                        </Typography>
                        <Typography
                          onClick={() => {
                            setDetailType('participants');
                            void fetchDetailGroup();
                            setIsShowSeeMore(true);
                          }}
                          className="text-md text-[#3AC4A0] font-poppins mb-2"
                        >
                          {t('chat.seeMore')}
                        </Typography>
                      </div>
                      {personalLinksData?.map((item: PersonalChatMediaData) => (
                        <div key={item?.id} className="w-full overflow-hidden">
                          <div className="flex gap-4">
                            <Image
                              src={otherUserData?.avatar as string}
                              alt="Avatar"
                              width={30}
                              height={30}
                              className="rounded-full w-[30px] h-[30px]"
                            />
                            <div className="flex flex-col">
                              <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                                {otherUserData?.name}
                              </Typography>
                              <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                                {moment(item?.created_at).format('MM/DD/YYYY')}
                              </Typography>

                              <Typography
                                href={item?.content_text}
                                className="text-mxl underline font-medium text-[#262626] font-poppins mb-2 break-all overflow-hidden text-ellipsis"
                              >
                                {item?.content_text}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {isShowSeeMore ? (
                <>
                  <div className="flex justify-between items-center">
                    <div
                      onClick={() => {
                        setIsShowSeeMore(false);
                      }}
                    >
                      <Image
                        alt="Back"
                        src={back_nav}
                        className="h-6 w-6 object-cover"
                      />
                    </div>
                    <Image
                      src={more_vertical}
                      alt="threeDots"
                      className="cursor-pointer"
                    />
                  </div>
                  {renderDetailChatItem()}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div
                      onClick={() => {
                        setIsShowDetail(false);
                      }}
                    >
                      <Image
                        alt="Back"
                        src={back_nav}
                        className="h-6 w-6 object-cover"
                      />
                    </div>
                    <Image
                      src={more_vertical}
                      alt="threeDots"
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="w-full py-4 flex flex-col gap-4 justify-center items-center bg-[#DCFCE4]">
                    <img
                      src={otherUserData?.avatar as string}
                      alt="avatar"
                      className="rounded-full w-36 h-36 bg-[#3AC4A0]"
                    />
                    <Typography className="text-md text-[#3AC4A0] font-poppins">
                      @{otherUserData?.seeds_tag}
                    </Typography>
                  </div>
                  <div className="w-full flex flex-col p-4 gap-8">
                    <div>
                      <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                        Bio
                      </Typography>
                      <Typography className="text-md text-[#262626] font-poppins">
                        {otherUserData?.bio}
                      </Typography>
                    </div>
                    <div className="w-full border-b border-[#E9E9E9]">
                      <div className="w-full flex justify-between">
                        <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                          Notes
                        </Typography>
                        <Typography
                          onClick={() => {
                            setDetailType('note');
                            void fetchDetailPersonal();
                            setIsShowSeeMore(true);
                          }}
                          className="text-md text-[#3AC4A0] font-poppins mb-2"
                        >
                          {t('chat.seeMore')}
                        </Typography>
                      </div>

                      {personalNotesData?.map((item: PersonalChatNotesData) => (
                        <div key={item?.id}>
                          <div className="flex gap-4">
                            <Image
                              src={otherUserData?.avatar as string}
                              alt="Avatar"
                              width={30}
                              height={30}
                              className="rounded-full w-[30px] h-[30px]"
                            />
                            <div className="flex flex-col">
                              <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                                {otherUserData?.name}
                              </Typography>
                              <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                                {moment(item?.created_at).format(
                                  'MM/DD/YY, HH:mm'
                                )}
                              </Typography>
                              <Typography className="text-mxl font-medium text-[#262626] font-poppins mb-2">
                                {item?.content_text}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-between">
                        <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                          Media
                        </Typography>
                        <Typography
                          onClick={() => {
                            setDetailType('media');
                            setIsShowSeeMore(true);
                          }}
                          className="text-md text-[#3AC4A0] font-poppins mb-2"
                        >
                          {t('chat.seeMore')}
                        </Typography>
                      </div>
                      <div className="w-full flex gap-4">
                        {personalMediaData?.map(
                          (item: PersonalChatMediaData) => {
                            if (item.media_url.includes('mp3')) {
                              return null;
                            }
                            if (
                              item.media_url.includes('mp4') ||
                              item.media_url.includes('mov')
                            ) {
                              return (
                                <div
                                  key={item.id}
                                  className="w-1/3 h-42 rounded-md"
                                >
                                  <video width="320" height="144" controls>
                                    <source
                                      src={item.media_url}
                                      type="video/mp4"
                                    />
                                  </video>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  key={item.id}
                                  className="w-1/3 h-36 rounded-md"
                                >
                                  <img
                                    src={item?.media_url}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              );
                            }
                          }
                        )}
                      </div>
                    </div>
                    <div className="w-full border-b border-[#E9E9E9]">
                      <div className="w-full flex justify-between">
                        <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                          Links
                        </Typography>
                        <Typography
                          onClick={() => {
                            setDetailType('link');
                            setIsShowSeeMore(true);
                          }}
                          className="text-md text-[#3AC4A0] font-poppins mb-2"
                        >
                          {t('chat.seeMore')}
                        </Typography>
                      </div>
                      {personalLinksData?.map((item: PersonalChatMediaData) => (
                        <div key={item?.id} className="w-full overflow-hidden">
                          <div className="flex gap-4">
                            <Image
                              src={otherUserData?.avatar as string}
                              alt="Avatar"
                              width={30}
                              height={30}
                              className="rounded-full w-[30px] h-[30px]"
                            />
                            <div className="flex flex-col">
                              <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                                {otherUserData?.name}
                              </Typography>
                              <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                                {moment(item?.created_at).format('MM/DD/YYYY')}
                              </Typography>

                              <Link
                                href={item?.content_text}
                                className="text-mxl underline font-medium text-[#262626] font-poppins mb-2 break-all overflow-hidden text-ellipsis"
                              >
                                {item?.content_text}
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-full border-b border-[#E9E9E9]">
                      <div className="w-full flex justify-between">
                        <Typography className="text-md font-semibold text-[#7C7C7C] font-poppins mb-2">
                          {t('chat.commonGroup')}
                        </Typography>
                        <Typography
                          onClick={() => {
                            setDetailType('groups');
                            setIsShowSeeMore(true);
                          }}
                          className="text-md text-[#3AC4A0] font-poppins mb-2"
                        >
                          {t('chat.seeMore')}
                        </Typography>
                      </div>
                      {commonGroupData?.map((item: CommonGroupData) => (
                        <div key={item?.id}>
                          <div className="flex gap-4">
                            <Image
                              src={item?.avatar}
                              alt="Avatar"
                              width={56}
                              height={56}
                              className="rounded-full w-14 h-14"
                            />
                            <div className="flex flex-col">
                              <Typography className="text-md font-semibold text-[#262626] font-poppins mb-2">
                                {item?.name}
                              </Typography>
                              <Typography className="text-md text-[#7c7c7c] font-poppins mb-2">
                                {item?.top_members
                                  ?.map(member => member.name)
                                  .join(', ')}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CCard>
      ) : (
        <div className="flex justify-start gap-4">
          <CCard
            className={`lg:flex flex-col border-none rounded-xl bg-white max-h-[90vh] ${
              chatList?.length !== 0 || isChatActive
                ? 'lg:w-1/3 w-full'
                : 'w-full'
            } ${isChatActive ? 'hidden' : 'flex'}`}
          >
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 justify-between py-5 px-4 border-b-2 border-[#E9E9E9]">
              <div className="flex items-center">
                <Typography className="font-semibold text-lg text-[#201B1C] font-poppins">
                  Chat
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  className="rounded-full w-fit capitalize py-2 px-3 border border-[#3AC4A0]"
                  onClick={() => {
                    handleDropdownOptionClick('New');
                  }}
                >
                  <div className="flex gap-1">
                    <Image
                      src={chatIcon1}
                      alt="chatIcon"
                      width={16}
                      height={16}
                    />
                    <Typography className="font-semibold text-sm text-[#3AC4A0] font-poppins">
                      {t('chat.newChat')}
                    </Typography>
                    <div className="flex items-center">
                      <Image
                        src={dropdownGreen}
                        alt="chatIcon"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex flex-col my-4 px-4">
              <div className="flex justify-start bg-[#3AC4A0] p-3 rounded-3xl w-full">
                <div className="flex items-center gap-1">
                  <Image src={seedsChat} alt="seeds" width={50} height={50} />
                  <div className="flex flex-col">
                    <Typography className="font-semibold text-sm xl:text-base text-[#FFFFFF] font-poppins">
                      {t('chat.willHelp')}
                    </Typography>

                    <Typography className="font-normal text-xs xl:text-sm text-[#FFFFFF] font-poppins">
                      {t('chat.startConversation')}
                    </Typography>
                  </div>
                </div>
              </div>
              <Tabs value={activeTab}>
                <TabsHeader
                  className="w-full text-center justify-center rounded-none bg-transparent p-0 mt-3"
                  indicatorProps={{
                    className: 'shadow-none rounded-none bg-transparent'
                  }}
                >
                  {dataTab.map((el: TabTypes) => {
                    return (
                      <Tab
                        value={el.value}
                        key={el.id}
                        onClick={el.handler}
                        className={`text-center z-0 text-sm md:text-lg bg-transparent font-poppins py-3 ${
                          activeTab === el.value
                            ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-2 border-b-[#4FE6AF]'
                            : 'text-[#7C7C7C] font-normal border-b-[#BDBDBD] border-b'
                        }`}
                      >
                        <Typography
                          className={
                            activeTab === el.value
                              ? 'text-sm font-semibold'
                              : 'text-sm font-normal'
                          }
                        >
                          {el.name}
                        </Typography>
                      </Tab>
                    );
                  })}
                </TabsHeader>
                <TabsBody>
                  <TabPanel value="PERSONAL" className="py-0 pt-2 px-0">
                    <ContactList
                      data={chatList}
                      handleFilterUnreadChange={handleFilterUnreadChange}
                      handleListClick={handleListClick}
                      isLoading={isLoading}
                    />
                    {chatList?.length === 0 && (
                      <div className="flex flex-col items-center gap-4 py-10">
                        <Image src={seedyChatPersonal} alt="Seedy No Chat" />
                        <Typography className="font-poppins font-semibold text-xl text-[#3AC4A0]">
                          {t('chat.personalEmptyState')}
                        </Typography>
                        <Typography className="font-poppins font-medium text-[#7C7C7C]">
                          {t('chat.selectUsername')}
                        </Typography>
                        <Button
                          variant="filled"
                          className="rounded-full w-fit capitalize py-2 px-3 border bg-[#3AC4A0]"
                          onClick={() => {
                            handleDropdownOptionClick('New');
                          }}
                        >
                          <div className="flex gap-1">
                            <Typography className="font-semibold text-sm text-white font-poppins">
                              {t('chat.chatPeople')}
                            </Typography>
                          </div>
                        </Button>
                      </div>
                    )}
                  </TabPanel>
                  <TabPanel value="COMMUNITY" className="py-0 pt-2 px-0">
                    <ContactList
                      data={chatList}
                      handleFilterUnreadChange={handleFilterUnreadChange}
                      handleListClick={handleListClick}
                      isLoading={isLoading}
                    />
                    {chatList?.length === 0 && (
                      <div className="flex flex-col items-center gap-4 py-10">
                        <Image src={seedyChatCommunty} alt="Seedy No Chat" />
                        <Typography className="font-poppins font-semibold text-xl text-[#3AC4A0]">
                          {t('chat.communityEmptyState')}
                        </Typography>
                        <Typography className="font-poppins font-medium text-[#7C7C7C]">
                          {t('chat.selectUsername')}
                        </Typography>
                        <Button
                          variant="filled"
                          className="rounded-full w-fit capitalize py-2 px-3 border bg-[#3AC4A0]"
                          onClick={() => {
                            handleDropdownOptionClick('New');
                          }}
                        >
                          <div className="flex gap-1">
                            <Typography className="font-semibold text-sm text-white font-poppins">
                              {t('chat.createCommunity')}
                            </Typography>
                          </div>
                        </Button>
                      </div>
                    )}
                  </TabPanel>
                  <TabPanel value="REQUEST" className="py-0 pt-2 px-0">
                    <ContactList
                      data={chatList}
                      handleFilterUnreadChange={handleFilterUnreadChange}
                      handleListClick={handleListClick}
                      isLoading={isLoading}
                    />
                  </TabPanel>
                </TabsBody>
              </Tabs>
            </div>
          </CCard>
          {(chatList?.length !== 0 || isChatActive) && (
            <CCard
              className={`lg:flex lg:flex-col border-none rounded-xl bg-white ${
                isChatActive ? 'lg:w-2/3 w-full flex' : 'w-full hidden'
              }`}
            >
              {roomId !== undefined && isChatActive ? (
                <>
                  {isSearchActive ? (
                    <div className="flex w-full justify-around">
                      <Image
                        src={XIcon}
                        alt="X"
                        width={30}
                        height={30}
                        onClick={() => {
                          setIsSearchActive(false);
                        }}
                        className="mx-2 w-1/8 hover:scale-110 transition ease-out cursor-pointer"
                      />
                      <input
                        type="text"
                        className="p-2 border-2 w-full rounded-xl m-2"
                        value={searchText}
                        onChange={handleSearchTextChange}
                        placeholder="Search..."
                      />
                      <div className="justify-center items-center  w-1/8 mx-2 my-auto">
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 7L7 1L1 7"
                            stroke="#262626"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="justify-center my-auto items-center mx-2 w-1/8">
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L7 7L13 1"
                            stroke="#262626"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex pt-5 px-4 border-b border-solid">
                      <div className="flex gap-4 w-full">
                        <div className="flex flex-col">
                          <div
                            className="flex items-center"
                            onClick={() => {
                              setIsShowDetail(true);
                              void (activeTab === 'COMMUNITY'
                                ? fetchDetailGroup()
                                : fetchDetailPersonal());
                            }}
                          >
                            <img
                              src={
                                activeTab === 'COMMUNITY'
                                  ? groupData?.avatar
                                  : (otherUserData?.avatar as string)
                              }
                              alt="avatar"
                              className="rounded-full w-12 h-12"
                            />
                          </div>
                          <div
                            className={`relative w-3 h-3 rounded-full ${
                              (otherUserData?.status_online as boolean)
                                ? 'bg-[#3AC4A0]'
                                : 'bg-transparent'
                            }bottom-3 left-9 border border-white`}
                          ></div>
                        </div>
                        <div className="flex justify-between w-full h-fit">
                          {activeTab === 'COMMUNITY' ? (
                            <div
                              className="flex flex-col gap-2 h-fit"
                              onClick={() => {
                                setIsShowDetail(true);
                                void fetchDetailGroup();
                              }}
                            >
                              <Typography className="font-semibold text-sm text-black font-poppins">
                                {groupData?.name}
                              </Typography>
                              <Typography className="font-normal text-sm text-[#7C7C7C] font-poppins max-h-[20px] overflow-hidden">
                                {`People (${
                                  groupData?.total_memberships as number
                                })`}
                              </Typography>
                            </div>
                          ) : (
                            <div
                              className="flex flex-col gap-2 h-fit"
                              onClick={() => {
                                setIsShowDetail(true);
                                void fetchDetailPersonal();
                              }}
                            >
                              <Typography className="font-semibold text-sm text-black font-poppins">
                                {otherUserData?.name}
                              </Typography>
                              <Typography className="font-normal text-sm text-[#7C7C7C] font-poppins max-h-[20px] overflow-hidden">
                                {isOnline ? 'Online' : 'Offline'}
                              </Typography>
                            </div>
                          )}
                          <div className="relative flex items-center">
                            <Image
                              src={threedotsVertical}
                              alt="threedots"
                              width={24}
                              height={24}
                              onClick={e => {
                                // Menambahkan event.stopPropagation() untuk menghentikan propogasi klik
                                e.stopPropagation();
                                handleToggleDropdown();
                              }}
                            />
                            {isDropdownOpen && (
                              <div className="absolute z-10 right-2 top-8 flex flex-col mt-2 bg-white border border-gray-300 rounded-md shadow-md">
                                <div
                                  className="dropdown-option flex p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    handleDropdownOptionClick('Search');
                                  }}
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M17.9438 17.0579L14.0321 13.1469C15.1659 11.7858 15.7312 10.0399 15.6106 8.2725C15.4899 6.50512 14.6925 4.85229 13.3843 3.65785C12.076 2.46341 10.3576 1.81932 8.58657 1.85957C6.81553 1.89982 5.12818 2.62131 3.87554 3.87395C2.62289 5.12659 1.9014 6.81394 1.86115 8.58498C1.8209 10.356 2.46499 12.0744 3.65943 13.3827C4.85387 14.6909 6.5067 15.4883 8.27409 15.609C10.0415 15.7297 11.7874 15.1643 13.1485 14.0305L17.0595 17.9422C17.1175 18.0003 17.1865 18.0464 17.2623 18.0778C17.3382 18.1092 17.4195 18.1254 17.5016 18.1254C17.5838 18.1254 17.6651 18.1092 17.741 18.0778C17.8168 18.0464 17.8858 18.0003 17.9438 17.9422C18.0019 17.8842 18.048 17.8152 18.0794 17.7394C18.1108 17.6635 18.127 17.5822 18.127 17.5001C18.127 17.4179 18.1108 17.3366 18.0794 17.2607C18.048 17.1849 18.0019 17.1159 17.9438 17.0579ZM3.12664 8.75006C3.12664 7.63754 3.45654 6.55 4.07463 5.62497C4.69271 4.69995 5.57121 3.97898 6.59905 3.55323C7.62688 3.12749 8.75788 3.0161 9.84903 3.23314C10.9402 3.45018 11.9424 3.98591 12.7291 4.77258C13.5158 5.55925 14.0515 6.56153 14.2686 7.65267C14.4856 8.74382 14.3742 9.87482 13.9485 10.9027C13.5227 11.9305 12.8018 12.809 11.8767 13.4271C10.9517 14.0452 9.86416 14.3751 8.75164 14.3751C7.26031 14.3734 5.83053 13.7802 4.77599 12.7257C3.72146 11.6712 3.1283 10.2414 3.12664 8.75006Z"
                                      fill="#201B1C"
                                    />
                                  </svg>
                                  <h1 className="text-sm ms-2 font-poppins font-normal">
                                    {t('chat.search')}
                                  </h1>
                                </div>
                                <div
                                  className="dropdown-option flex p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    handleDropdownOptionClick('Mute');
                                  }}
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.21159 2.70461C4.15671 2.64274 4.09009 2.59238 4.01559 2.55645C3.9411 2.52052 3.86022 2.49972 3.77763 2.49528C3.69504 2.49084 3.61239 2.50283 3.53448 2.53057C3.45656 2.5583 3.38492 2.60122 3.32371 2.65685C3.2625 2.71247 3.21295 2.77969 3.17791 2.85461C3.14287 2.92953 3.12305 3.01065 3.1196 3.09329C3.11615 3.17592 3.12913 3.25842 3.1578 3.336C3.18646 3.41358 3.23024 3.4847 3.28659 3.54524L4.59441 4.9843C4.03899 5.93764 3.74723 7.02159 3.74909 8.12492C3.74909 10.8859 3.10378 12.9984 2.67019 13.7452C2.55946 13.9351 2.50076 14.1508 2.50001 14.3706C2.49925 14.5904 2.55647 14.8066 2.66589 14.9972C2.77531 15.1878 2.93306 15.3462 3.12324 15.4564C3.31342 15.5666 3.52929 15.6248 3.74909 15.6249H14.2678L15.7866 17.2952C15.8415 17.3571 15.9081 17.4075 15.9826 17.4434C16.0571 17.4793 16.138 17.5001 16.2206 17.5046C16.3031 17.509 16.3858 17.497 16.4637 17.4693C16.5416 17.4416 16.6133 17.3986 16.6745 17.343C16.7357 17.2874 16.7852 17.2202 16.8203 17.1452C16.8553 17.0703 16.8751 16.9892 16.8786 16.9066C16.882 16.8239 16.8691 16.7414 16.8404 16.6638C16.8117 16.5863 16.7679 16.5151 16.7116 16.4546L4.21159 2.70461ZM3.74909 14.3749C4.35066 13.3405 4.99909 10.9437 4.99909 8.12492C4.998 7.37805 5.16516 6.64053 5.48816 5.96711L13.1311 14.3749H3.74909ZM13.1241 17.4999C13.1241 17.6657 13.0582 17.8247 12.941 17.9419C12.8238 18.0591 12.6649 18.1249 12.4991 18.1249H7.49909C7.33333 18.1249 7.17436 18.0591 7.05715 17.9419C6.93994 17.8247 6.87409 17.6657 6.87409 17.4999C6.87409 17.3342 6.93994 17.1752 7.05715 17.058C7.17436 16.9408 7.33333 16.8749 7.49909 16.8749H12.4991C12.6649 16.8749 12.8238 16.9408 12.941 17.058C13.0582 17.1752 13.1241 17.3342 13.1241 17.4999ZM16.7178 14.0038C16.6448 14.0321 16.5672 14.0467 16.4889 14.0468C16.3634 14.0467 16.2408 14.0087 16.1371 13.938C16.0335 13.8672 15.9535 13.7668 15.9077 13.6499C15.3389 12.2023 14.9991 10.1366 14.9991 8.12492C14.9993 7.2504 14.7702 6.39111 14.3346 5.63281C13.899 4.87451 13.2721 4.24373 12.5165 3.80344C11.7609 3.36314 10.903 3.12872 10.0285 3.12358C9.15397 3.11844 8.29341 3.34276 7.53269 3.77414C7.38885 3.85208 7.22018 3.87052 7.0629 3.82548C6.90562 3.78045 6.77226 3.67554 6.69147 3.53328C6.61068 3.39102 6.58888 3.22276 6.63077 3.06461C6.67266 2.90646 6.77488 2.77104 6.9155 2.68743C7.86635 2.14809 8.94202 1.86758 10.0352 1.87388C11.1283 1.88019 12.2007 2.1731 13.1452 2.72338C14.0898 3.27365 14.8735 4.06204 15.4181 5.00986C15.9628 5.95768 16.2493 7.03177 16.2491 8.12492C16.2491 10.8866 16.878 12.7023 17.071 13.1937C17.1316 13.3479 17.1284 13.5199 17.0622 13.6719C16.9959 13.8238 16.8721 13.9432 16.7178 14.0038Z"
                                      fill="#201B1C"
                                    />
                                  </svg>
                                  <h1 className="text-sm ms-2 font-poppins font-normal">
                                    {t('chat.mute')}
                                  </h1>
                                </div>
                                <div
                                  className="dropdown-option flex p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    handleDropdownOptionClick('Delete');
                                  }}
                                >
                                  <svg
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M14.875 2.75H11.75V2.125C11.75 1.62772 11.5525 1.15081 11.2008 0.799175C10.8492 0.447544 10.3723 0.25 9.875 0.25H6.125C5.62772 0.25 5.15081 0.447544 4.79917 0.799175C4.44754 1.15081 4.25 1.62772 4.25 2.125V2.75H1.125C0.95924 2.75 0.800269 2.81585 0.683058 2.93306C0.565848 3.05027 0.5 3.20924 0.5 3.375C0.5 3.54076 0.565848 3.69973 0.683058 3.81694C0.800269 3.93415 0.95924 4 1.125 4H1.75V15.25C1.75 15.5815 1.8817 15.8995 2.11612 16.1339C2.35054 16.3683 2.66848 16.5 3 16.5H13C13.3315 16.5 13.6495 16.3683 13.8839 16.1339C14.1183 15.8995 14.25 15.5815 14.25 15.25V4H14.875C15.0408 4 15.1997 3.93415 15.3169 3.81694C15.4342 3.69973 15.5 3.54076 15.5 3.375C15.5 3.20924 15.4342 3.05027 15.3169 2.93306C15.1997 2.81585 15.0408 2.75 14.875 2.75ZM5.5 2.125C5.5 1.95924 5.56585 1.80027 5.68306 1.68306C5.80027 1.56585 5.95924 1.5 6.125 1.5H9.875C10.0408 1.5 10.1997 1.56585 10.3169 1.68306C10.4342 1.80027 10.5 1.95924 10.5 2.125V2.75H5.5V2.125ZM13 15.25H3V4H13V15.25ZM6.75 7.125V12.125C6.75 12.2908 6.68415 12.4497 6.56694 12.5669C6.44973 12.6842 6.29076 12.75 6.125 12.75C5.95924 12.75 5.80027 12.6842 5.68306 12.5669C5.56585 12.4497 5.5 12.2908 5.5 12.125V7.125C5.5 6.95924 5.56585 6.80027 5.68306 6.68306C5.80027 6.56585 5.95924 6.5 6.125 6.5C6.29076 6.5 6.44973 6.56585 6.56694 6.68306C6.68415 6.80027 6.75 6.95924 6.75 7.125ZM10.5 7.125V12.125C10.5 12.2908 10.4342 12.4497 10.3169 12.5669C10.1997 12.6842 10.0408 12.75 9.875 12.75C9.70924 12.75 9.55027 12.6842 9.43306 12.5669C9.31585 12.4497 9.25 12.2908 9.25 12.125V7.125C9.25 6.95924 9.31585 6.80027 9.43306 6.68306C9.55027 6.56585 9.70924 6.5 9.875 6.5C10.0408 6.5 10.1997 6.56585 10.3169 6.68306C10.4342 6.80027 10.5 6.95924 10.5 7.125Z"
                                      fill="#FF3838"
                                    />
                                  </svg>
                                  <h1 className="text-sm ms-2 font-normal font-poppins text-[#FF3838]">
                                    {t('chat.deleteChat')}
                                  </h1>
                                </div>
                                {activeTab === 'COMMUNITY' && (
                                  <div
                                    className="dropdown-option flex p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                      handleDropdownOptionClick('Leave');
                                    }}
                                  >
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5"
                                        stroke="#FF3838"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M13.332 14.1663L17.4987 9.99967L13.332 5.83301"
                                        stroke="#FF3838"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M17.5 10H7.5"
                                        stroke="#FF3838"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>

                                    <h1 className="text-sm ms-2 font-normal font-poppins text-[#FF3838] whitespace-nowrap">
                                      {t('chat.popUpLeave.Title')}
                                    </h1>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    ref={containerRef}
                    className={`relative bg-[#E9E9E980] flex-grow w-full min-h-[420px] py-4 max-h-[70vh] overflow-y-scroll`}
                  >
                    {messageList.length === 0 && (
                      <div className="flex flex-col gap-4 items-center justify-center h-full">
                        <Image alt="Chat Empty" src={chatEmpty} />
                        <Typography className="font-poppins text-[#7C7C7C] w-60 text-center">
                          {t('chat.emptyChat')}
                        </Typography>
                      </div>
                    )}
                    {messageList.length > 0 && (
                      <div className="flex flex-col gap-4 justify-end">
                        {messageList.map((message: IChatBubble, index) => {
                          if (message.created_by === dataUser.id) {
                            if (message.content_text?.length > 0) {
                              return (
                                <div
                                  key={message.id}
                                  className="flex flex-col w-full"
                                >
                                  <div className="bg-[#DCFCE4] p-2 self-end max-w-[60%] rounded-lg mx-4">
                                    <Typography
                                      className={
                                        message.content_text.includes(
                                          searchText
                                        ) && searchText !== ''
                                          ? 'font-poppins break-all text-[#262626] bg-[#FBF719]'
                                          : 'font-poppins break-all text-[#262626]'
                                      }
                                    >
                                      {message.content_text}
                                    </Typography>
                                  </div>
                                  {message?.read_at !==
                                    '0001-01-01T00:00:00Z' && (
                                    <>
                                      {(messageList[index + 1]?.read_at ===
                                        '0001-01-01T00:00:00Z' ||
                                        messageList?.length === index + 1) && (
                                        <Typography className="font-poppins text-[#BDBDBD] self-end mr-4">
                                          {t('chat.seen')}
                                        </Typography>
                                      )}
                                    </>
                                  )}
                                </div>
                              );
                            }
                            if (
                              message.media_urls?.length > 0 &&
                              message.media_urls[0]?.includes('mp3')
                            ) {
                              return (
                                <audio
                                  key={message?.id}
                                  controls
                                  className="self-end"
                                >
                                  <source
                                    src={message.media_urls[0]}
                                    type="audio/wav"
                                    className="w-full"
                                  />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                              );
                            }
                            if (
                              message.media_urls?.length > 0 &&
                              (message.media_urls[0]?.includes('mp4') ||
                                message.media_urls[0]?.includes('mov'))
                            ) {
                              return (
                                <div
                                  key={message.id}
                                  className="p-2 self-end max-w-[60%] rounded-lg mx-4"
                                >
                                  <video width="320" height="240" controls>
                                    <source
                                      src={message.media_urls[0]}
                                      type="video/mp4"
                                    />
                                  </video>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  key={message.id}
                                  className="p-2 self-end max-w-[60%] rounded-lg mx-4"
                                >
                                  <img src={message?.media_urls[0]} />
                                </div>
                              );
                            }
                          } else {
                            if (message.content_text?.length > 0) {
                              return (
                                <div className="flex ml-4" key={message.id}>
                                  <Image
                                    width={32}
                                    height={32}
                                    src={otherUserData?.avatar as string}
                                    alt="avatar"
                                    className="rounded-full w-8 h-8"
                                  />
                                  <div className="bg-[#3AC4A0] p-2 self-start max-w-[60%] rounded-lg mx-2">
                                    <Typography
                                      className={
                                        message.content_text.includes(
                                          searchText
                                        ) && searchText !== ''
                                          ? 'font-poppins break-all text-[#fff] bg-[#FBF719]'
                                          : 'font-poppins break-all text-[#fff]'
                                      }
                                    >
                                      {message.content_text}
                                    </Typography>
                                  </div>
                                </div>
                              );
                            }
                            if (
                              message.media_urls?.length > 0 &&
                              message.media_urls[0]?.includes('mp3')
                            ) {
                              return (
                                <div className="flex ml-4" key={message.id}>
                                  <Image
                                    width={32}
                                    height={32}
                                    src={otherUserData?.avatar as string}
                                    alt="avatar"
                                    className="rounded-full w-8 h-8"
                                  />
                                  <audio controls>
                                    <source
                                      src={message.media_urls[0]}
                                      type="audio/wav"
                                      className="w-full"
                                    />
                                    Your browser does not support the audio
                                    element.
                                  </audio>
                                </div>
                              );
                            }
                            if (
                              message.media_urls?.length > 0 &&
                              (message.media_urls[0]?.includes('mp4') ||
                                message.media_urls[0]?.includes('mov'))
                            ) {
                              return (
                                <div className="flex ml-4" key={message.id}>
                                  <Image
                                    width={32}
                                    height={32}
                                    src={otherUserData?.avatar as string}
                                    alt="avatar"
                                    className="rounded-full w-8 h-8"
                                  />
                                  <div
                                    key={message.id}
                                    className="p-2 self-start max-w-[60%] rounded-lg"
                                  >
                                    <video width="320" height="240" controls>
                                      <source
                                        src={message.media_urls[0]}
                                        type="video/mp4"
                                      />
                                    </video>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div className="flex ml-4" key={message.id}>
                                  <Image
                                    width={32}
                                    height={32}
                                    src={otherUserData?.avatar as string}
                                    alt="avatar"
                                    className="rounded-full w-8 h-8"
                                  />
                                  <div
                                    key={message.id}
                                    className="p-2 self-start max-w-[60%] rounded-lg"
                                  >
                                    <img src={message?.media_urls[0]} />
                                  </div>
                                </div>
                              );
                            }
                          }
                        })}
                      </div>
                    )}
                    {activeTab === 'REQUEST' && (
                      <div className="absolute bottom-4 w-full gap-4 px-8 flex">
                        <Button
                          variant="outlined"
                          className="rounded-full w-1/2 capitalize py-2 border border-[#DD2525]"
                          onClick={() => {
                            void rejectRequestChat();
                          }}
                        >
                          <div className="flex justify-center">
                            <Typography className="font-semibold text-sm text-[#DD2525] font-poppins">
                              {t('chat.reject')}
                            </Typography>
                          </div>
                        </Button>
                        <Button
                          variant="filled"
                          className="rounded-full w-1/2 capitalize py-2 border border-[#3AC4A0] bg-[#3AC4A0]"
                          onClick={() => {
                            void acceptRequestChat();
                          }}
                        >
                          <div className="flex justify-center">
                            <Typography className="font-semibold text-sm text-white font-poppins">
                              {t('chat.accept')}
                            </Typography>
                          </div>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="bg-white px-4 py-2 rounded-b-xl">
                    {isVoiceRecording ? (
                      <div className="flex items-center gap-3">
                        <ChatVoiceRecorder
                          setAudio={setAudio}
                          setLoading={setIsLoading}
                          postMedia={handleSendVoiceMessage}
                          setIsVoiceRecording={setIsVoiceRecording}
                          audio={audio}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="relative flex">
                          <div
                            className="dropdown-option flex cursor-pointer"
                            onClick={() => {
                              handleDropdownOptionClick('Gif');
                            }}
                          >
                            <svg
                              width="16"
                              height="14"
                              viewBox="0 0 16 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.4 0C14.786 0 15.92 1.187 15.996 2.682L16 2.844V11.156C16 12.673 14.915 13.912 13.547 13.996L13.4 14H2.6C1.214 14 0.0799999 12.813 0.00399995 11.318L0 11.156V2.844C0 1.327 1.085 0.0879999 2.452 0.00399995L2.6 0H13.4ZM13.25 1H2.75C1.824 1 1.066 1.793 1.004 2.797L1 2.929V11.071C1 12.092 1.72 12.928 2.63 12.996L2.75 13H13.25C14.176 13 14.934 12.207 14.996 11.204L15 11.07V2.93C15 1.909 14.28 1.073 13.37 1.005L13.25 1ZM4.851 4.002C5.471 4.002 5.999 4.099 6.432 4.301C6.699 4.425 6.806 4.725 6.672 4.972C6.60066 5.09307 6.48654 5.18302 6.35215 5.22412C6.21776 5.26521 6.07286 5.25447 5.946 5.194C5.678 5.069 5.314 5.002 4.851 5.002C3.825 5.002 3.081 5.834 3.081 7.002C3.081 8.121 3.894 9 4.851 9C5.448 9 5.853 8.649 5.911 8.327L5.919 8.247V7.501L5.54 7.5C5.242 7.5 5 7.276 5 7C5 6.755 5.191 6.55 5.443 6.508L5.541 6.5L6.459 6.501C6.58139 6.49737 6.70126 6.53623 6.79824 6.61097C6.89522 6.68571 6.96333 6.79173 6.991 6.911L7 7.001V8.247C7 9.124 6.114 10 4.851 10C3.256 10 2 8.642 2 7.001C2 5.32 3.177 4.002 4.851 4.002ZM9 4C9.11703 3.99996 9.23036 4.04097 9.32026 4.11589C9.41016 4.19081 9.47093 4.29489 9.492 4.41L9.5 4.5V9.5C9.50023 9.62495 9.45367 9.74545 9.36949 9.83778C9.28531 9.93012 9.16961 9.98759 9.04518 9.99888C8.92074 10.0102 8.79659 9.97446 8.69717 9.89878C8.59775 9.8231 8.53026 9.71295 8.508 9.59L8.5 9.5V4.5C8.5 4.36739 8.55268 4.24021 8.64645 4.14645C8.74021 4.05268 8.86739 4 9 4ZM13.5 4C13.6249 3.99977 13.7455 4.04633 13.8378 4.13051C13.9301 4.21469 13.9876 4.33039 13.9989 4.45482C14.0102 4.57926 13.9745 4.70341 13.8988 4.80283C13.8231 4.90225 13.7129 4.96974 13.59 4.992L13.5 5H12V7H13.5C13.6249 6.99977 13.7455 7.04633 13.8378 7.13051C13.9301 7.21469 13.9876 7.33039 13.9989 7.45482C14.0102 7.57926 13.9745 7.70341 13.8988 7.80283C13.8231 7.90225 13.7129 7.96974 13.59 7.992L13.5 8H12V9.5C12.0002 9.62495 11.9537 9.74545 11.8695 9.83778C11.7853 9.93012 11.6696 9.98759 11.5452 9.99888C11.4207 10.0102 11.2966 9.97446 11.1972 9.89878C11.0977 9.8231 11.0303 9.71295 11.008 9.59L11 9.5V4.5C11 4.36739 11.0527 4.24021 11.1464 4.14645C11.2402 4.05268 11.3674 4 11.5 4H13.5Z"
                                fill="#201B1C"
                              />
                            </svg>
                          </div>
                          {isShowGifPopup && (
                            <div className="absolute left-2 bottom-8 flex flex-col mt-2 bg-white border border-gray-300 rounded-md shadow-md">
                              <GifChat
                                sendGif={handleSendGifMessage}
                                onClose={() => {
                                  setIsShowGifPopup(false);
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex w-5 cursor-pointer">
                          <Image
                            src={camera}
                            alt="camera"
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className="flex relative cursor-pointer">
                          <input
                            type="file"
                            id="MediaUpload"
                            onChange={handleSendImageMessage}
                            className="absolute inset-0 opacity-0"
                            accept="image/jpg,image/jpeg,image/png,video/mp4,video/mov"
                          />
                          <Image
                            src={galleryChat}
                            alt="gallery"
                            width={16}
                            height={16}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex w-full">
                          <textarea
                            value={message}
                            onChange={handleMessageChange}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            className="focus:outline-none placeholder:text-[#7C7C7C] bg-[#E9E9E9] w-full text-sm font-normal py-3 px-4 rounded-full resize-none"
                            placeholder={t('chat.textInputPlaceholder') ?? ''}
                          />
                        </div>
                        <div
                          onClick={() => {
                            setIsVoiceRecording(true);
                          }}
                          className="w-5"
                        >
                          <Image src={mic} alt="mic" width={20} height={20} />
                        </div>
                        <button onClick={handleSendMessage}>
                          <Image
                            src={sendChat}
                            alt="send"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-center items-center h-full">
                  <Image src={seedyChatNotSelected} alt="No Conversation Yet" />
                  <Typography className="font-poppins font-semibold text-xl text-[#3AC4A0]">
                    {t('chat.personalEmptyState')}
                  </Typography>
                  <Typography className="font-poppins font-medium text-[#7C7C7C]">
                    {t('chat.selectUsername')}
                  </Typography>
                </div>
              )}
            </CCard>
          )}
        </div>
      )}
    </PageGradient>
  );
};

export default withAuth(ChatPages);
