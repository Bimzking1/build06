'use client';
import block from '@/assets/more-option/block.svg';
import close from '@/assets/more-option/close.svg';
import delet from '@/assets/more-option/delete.svg';
import edit from '@/assets/more-option/edit.svg';
import flag from '@/assets/more-option/flag.svg';
import more_vertical from '@/assets/more-option/more_vertical.svg';
import post_report_photo from '@/assets/more-option/post_report_photo.png';
import report_user from '@/assets/more-option/report_user.svg';
import user_report_photo from '@/assets/more-option/user_report_photo.png';
import ModalMention from '@/containers/circle/[id]/ModalMention';
import { blockOtherUser } from '@/repository/profile.repository';
import { follow } from '@/repository/user.repository';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Radio
} from '@material-tailwind/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineUserDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Loading from './popup/Loading';

interface props {
  dataPost: any;
  userInfo: any;
  setDataPost: any;
  handleSubmitBlockUser?: any;
  myInfo?: any;
}

const listReportPost = async (): Promise<any> => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
      }/report/v1/questions`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const listReportUser = async (): Promise<any> => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
      }/report/v1/questions?type=user`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const Icon = (): any => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 5C7.2 5 5 7.2 5 10C5 12.8 7.2 15 10 15C12.8 15 15 12.8 15 10C15 7.2 12.8 5 10 5ZM10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.6 18 2 14.4 2 10C2 5.6 5.6 2 10 2C14.4 2 18 5.6 18 10C18 14.4 14.4 18 10 18Z"
        fill="#3AC4A0"
      />
    </svg>
  );
};

const MoreOption = ({
  myInfo,
  dataPost,
  userInfo,
  setDataPost
}: props): any => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formDataPost, setFormPost] = React.useState({
    target_post_id: dataPost.id,
    type_report: '',
    question_report_id: ''
  });
  const [formDataUser, setFormUser] = React.useState({
    target_user_id: dataPost.user_id,
    type_report: '',
    question_report_id: ''
  });
  const handleChangePost = (id: string, value: string): any => {
    setFormPost({
      ...formDataPost,
      type_report: value,
      question_report_id: id
    });
  };
  const handleChangeUser = (id: string, value: string): any => {
    setFormUser({
      ...formDataUser,
      type_report: value,
      question_report_id: id
    });
  };

  const [listPost, setListPost] = React.useState<any[]>([]);
  const [listUser, setListUser] = React.useState<any[]>([]);
  const [reportPost, setReportPost] = React.useState(null);
  const [reportUser, setReportUser] = React.useState(null);
  const [verifyReportPost, setVerifyReportPost] = React.useState(null);
  const [verifyReportUser, setVerifyReportUser] = React.useState(null);
  const [blockUser, setBlockUser] = React.useState(null);
  const [deletePost, setDeletePost] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const [selectedPost, setSelectedPost] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [mobileView, setMobileView] = useState(false);

  const handleFollow = async (userId: string): Promise<void> => {
    try {
      const response = await follow(userId);
      const isFollowed = response?.status;
      setDataPost((prev: []) =>
        prev.map((post: { user_id: string; is_followed: boolean }) => {
          if (post.user_id === userId) {
            return { ...post, is_followed: isFollowed };
          }
          return post;
        })
      );
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  const handleOpen = (): void => {
    if (isOpen) {
      document.body.classList.remove('modal-open');
    } else {
      document.body.classList.add('modal-open');
    }
    setIsOpen(!isOpen);
  };

  const handleOpenReportPost = (value: any): void => {
    setReportPost(value);
    if (value === 'sm') {
      handleListReportPost();
    }
  };
  const handleOpenReportUser = (value: any): void => {
    setReportUser(value);
    if (value === 'sm') {
      handleListReportUser();
    }
  };
  const handleVerifyReportPost = (value: any): void => {
    setVerifyReportPost(value);
  };
  const handleVerifyReportUser = (value: any): void => {
    setVerifyReportUser(value);
  };
  const handleOpenBlock = (value: any): void => {
    setBlockUser(value);
  };
  const handleOpenDelete = (value: any): void => {
    setDeletePost(value);
  };

  const handleDisablePost = (option: any): void => {
    setSelectedPost(option);
  };
  const handleDisableUser = (option: any): void => {
    setSelectedUser(option);
  };

  const isDisabledPost = selectedPost === null;
  const isDisabledUser = selectedUser === null;

  const handleListReportPost = (): void => {
    listReportPost()
      .then(data => {
        setListPost(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleListReportUser = (): void => {
    listReportUser()
      .then(data => {
        setListUser(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleSubmitReportPost = async (): Promise<void> => {
    event?.preventDefault();
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
        }/report/v1/post`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('accessToken') ?? ''
            }`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataPost)
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSubmitReportUser = async (): Promise<void> => {
    event?.preventDefault();
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
        }/report/v1/user`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('accessToken') ?? ''
            }`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataUser)
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmitDeletePost = async (postId: string): Promise<void> => {
    event?.preventDefault();
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
        }/post/v2/delete/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('accessToken') ?? ''
            }`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      setDataPost((prev: []) =>
        prev.filter((post: { id: string }) => post.id !== postId)
      );
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmitBlockUser = async (): Promise<void> => {
    event?.preventDefault();
    try {
      const response = await blockOtherUser({ user_id: dataPost.user_id });
      setDataPost((prev: []) =>
        prev.filter(
          (post: { user_id: string }) => post.user_id !== dataPost.user_id
        )
      );
      return response;
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* TODO: EDIT POST MODAL */}
          <div>
            {isOpen && (
              <ModalMention
                handleOpen={handleOpen}
                open={isOpen}
                setIsLoading={setIsLoading}
                setDataPost={setDataPost}
                dataPost={dataPost}
                setGolId={() => {}}
              />
            )}
            <div
              onClick={() => {
                setMobileView(true);
              }}
              className="block sm:hidden"
            >
              <Image
                src={more_vertical}
                alt="threeDots"
                className="cursor-pointer"
              />
            </div>
            <div className="hidden sm:block">
              <Menu placement="left-start">
                <MenuHandler>
                  <Image
                    src={more_vertical}
                    alt="threeDots"
                    className="cursor-pointer"
                  />
                </MenuHandler>
                <MenuList className="hidden sm:flex list-none flex-col font-poppins gap-2 p-2 text-sm font-normal leading-5">
                  <MenuItem
                    className={`${
                      dataPost.user_id === (myInfo?.id ?? userInfo.id)
                        ? 'hidden'
                        : 'flex'
                    } py-2 gap-2 cursor-pointer`}
                    style={{ color: '#FF3838' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = '#FF3838')
                    }
                    onClick={() => {
                      void handleFollow(dataPost.user_id);
                    }}
                  >
                    <AiOutlineUserDelete size={20} />
                    {dataPost.is_followed === true
                      ? t('social.unfollow')
                      : t('social.follow')}
                  </MenuItem>
                  <MenuItem
                    className={`${
                      dataPost.user_id === (myInfo?.id ?? userInfo.id)
                        ? 'hidden'
                        : 'flex'
                    } py-2 gap-2 cursor-pointer`}
                    style={{ color: '#FF3838' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = '#FF3838')
                    }
                    onClick={() => {
                      handleOpenReportPost('sm');
                    }}
                  >
                    <Image src={flag} alt="reportPost" />
                    {`${t('social.reportPost.text1')}`}
                  </MenuItem>
                  <MenuItem
                    className={`${
                      dataPost.user_id === (myInfo?.id ?? userInfo.id)
                        ? 'hidden'
                        : 'flex'
                    }  py-2 gap-2 cursor-pointer`}
                    style={{ color: '#FF3838' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = '#FF3838')
                    }
                    onClick={() => {
                      handleOpenReportUser('sm');
                    }}
                  >
                    <Image src={report_user} alt="reportUser" />
                    {`${t('social.reportUser.text1')}`}
                  </MenuItem>
                  <MenuItem
                    className={`${
                      dataPost.user_id === (myInfo?.id ?? userInfo.id)
                        ? 'hidden'
                        : 'flex'
                    }  py-2 gap-2 cursor-pointer`}
                    style={{ color: '#FF3838' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = '#FF3838')
                    }
                    onClick={() => {
                      handleOpenBlock('xs');
                    }}
                  >
                    <Image src={block} alt="blockUser" />
                    {`${t('social.blockUser.block')}`} User
                  </MenuItem>
                  <MenuItem
                    className={`${
                      dataPost.user_id === (myInfo?.id ?? userInfo.id)
                        ? 'flex'
                        : 'hidden'
                    }  py-2 gap-2 cursor-pointer`}
                    style={{ color: '#000000' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = '#000000')
                    }
                    onClick={() => {
                      handleOpen();
                    }}
                  >
                    <Image src={edit} alt="editPost" />
                    Edit Post
                  </MenuItem>
                  <MenuItem
                    className={`${
                      dataPost.user_id === (myInfo?.id ?? userInfo.id)
                        ? 'flex'
                        : 'hidden'
                    }  py-2 gap-2 cursor-pointer`}
                    style={{ color: '#FF3838' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = '#FF3838')
                    }
                    onClick={() => {
                      handleOpenDelete('xs');
                    }}
                  >
                    <Image src={delet} alt="deletePost" />
                    Delete Post
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            {mobileView && (
              <div className="sm:hidden">
                <div className="fixed inset-0 bg-black opacity-50 z-40" />
                <div
                  className="fixed inset-0 flex items-end justify-center md:items-center z-50"
                  onClick={() => {
                    setMobileView(false);
                  }}
                >
                  <div className="bg-white rounded-t-2xl md:rounded-2xl overflow-hidden w-full md:w-3/4 lg:w-1/2 border-2">
                    <div className="px-4 pt-4 flex justify-between items-center">
                      <div className="flex justify-center items-center w-full">
                        <div
                          className="text-lg font-bold rounded-full bg-[#ececec] p-1 w-1/2 cursor-pointer"
                          onClick={() => {
                            setMobileView(false);
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="sm:flex list-none flex-col font-poppins gap-2 p-2 text-sm font-normal leading-5">
                        <MenuItem
                          className={`${
                            dataPost.user_id === (myInfo?.id ?? userInfo.id)
                              ? 'hidden'
                              : 'flex'
                          } py-2 gap-2 cursor-pointer`}
                          style={{ color: '#FF3838' }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.color = '#FF3838')
                          }
                          onClick={() => {
                            void handleFollow(dataPost.user_id);
                          }}
                        >
                          <AiOutlineUserDelete size={20} />
                          {dataPost.is_followed === true
                            ? t('social.unfollow')
                            : t('social.follow')}
                        </MenuItem>
                        <MenuItem
                          className={`${
                            dataPost.user_id === (myInfo?.id ?? userInfo.id)
                              ? 'hidden'
                              : 'flex'
                          } py-2 gap-2 cursor-pointer`}
                          style={{ color: '#FF3838' }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.color = '#FF3838')
                          }
                          onClick={() => {
                            handleOpenReportPost('sm');
                            setMobileView(false);
                          }}
                        >
                          <Image src={flag} alt="reportPost" />
                          {`${t('social.reportPost.text1')}`}
                        </MenuItem>
                        <MenuItem
                          className={`${
                            dataPost.user_id === (myInfo?.id ?? userInfo.id)
                              ? 'hidden'
                              : 'flex'
                          }  py-2 gap-2 cursor-pointer`}
                          style={{ color: '#FF3838' }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.color = '#FF3838')
                          }
                          onClick={() => {
                            handleOpenReportUser('sm');
                            setMobileView(false);
                          }}
                        >
                          <Image src={report_user} alt="reportUser" />
                          {`${t('social.reportUser.text1')}`}
                        </MenuItem>
                        <MenuItem
                          className={`${
                            dataPost.user_id === (myInfo?.id ?? userInfo.id)
                              ? 'hidden'
                              : 'flex'
                          }  py-2 gap-2 cursor-pointer`}
                          style={{ color: '#FF3838' }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.color = '#FF3838')
                          }
                          onClick={() => {
                            handleOpenBlock('xs');
                            setMobileView(false);
                          }}
                        >
                          <Image src={block} alt="blockUser" />
                          {`${t('social.blockUser.block')}`} User
                        </MenuItem>
                        <MenuItem
                          className={`${
                            dataPost.user_id === (myInfo?.id ?? userInfo.id)
                              ? 'flex'
                              : 'hidden'
                          }  py-2 gap-2 cursor-pointer`}
                          style={{ color: '#000000' }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.color = '#000000')
                          }
                          onClick={() => {
                            handleOpen();
                            setMobileView(false);
                          }}
                        >
                          <Image src={edit} alt="editPost" />
                          Edit Post
                        </MenuItem>
                        <MenuItem
                          className={`${
                            dataPost.user_id === (myInfo?.id ?? userInfo.id)
                              ? 'flex'
                              : 'hidden'
                          }  py-2 gap-2 cursor-pointer`}
                          style={{ color: '#FF3838' }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.color = '#FF3838')
                          }
                          onClick={() => {
                            handleOpenDelete('xs');
                            setMobileView(false);
                          }}
                        >
                          <Image src={delet} alt="deletePost" />
                          Delete Post
                        </MenuItem>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* TODO: MODAL REPORT POST */}
          <Dialog
            className="p-5 m-0 max-w-lg self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-2xl"
            dismiss={{
              outsidePress: false
            }}
            open={reportPost === 'sm'}
            size={'sm'}
            handler={handleOpenReportPost}
          >
            <DialogHeader className="p-0 font-poppins">
              <div className="min-w-full flex items-center justify-between border-b">
                <div className="flex gap-2 flex-col">
                  <p className="text-lg font-semibold text-[#262626]">
                    {`${t('social.reportPost.text1')}`}
                  </p>
                  <p className="text-sm font-normal text-[#7C7C7C] mb-4">
                    {`${t('social.reportPost.text2')}`}
                  </p>
                </div>
                <div className="mb-4">
                  <Image
                    src={close}
                    alt="close"
                    className="cursor-pointer"
                    onClick={() => {
                      handleChangePost('', '');
                      handleOpenReportPost(null);
                      setSelectedPost(null);
                    }}
                  />
                </div>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmitReportPost}>
              <DialogBody className="p-0 my-4 font-poppins">
                <p className="text-base font-semibold text-[#262626]">
                  {`${t('social.reportPost.text3')}`}
                </p>
                <div className="flex flex-col text-[#262626] text-base font-normal">
                  {listPost?.map((item, index) => {
                    return (
                      <div
                        className="flex items-center justify-between"
                        key={index}
                      >
                        <label
                          htmlFor={item.id}
                          className="cursor-pointer w-full"
                        >
                          {item.title === 'Spam' &&
                            `${t('social.reportPost.option1')}`}
                          {item.title === 'Nudity or sexual Activity' &&
                            `${t('social.reportPost.option2')}`}
                          {item.title === 'Hate speech or symbols' &&
                            `${t('social.reportPost.option3')}`}
                          {item.title === 'Bullying or harassment' &&
                            `${t('social.reportPost.option4')}`}
                          {item.title === 'I do not like it' &&
                            `${t('social.reportPost.option5')}`}
                          {item.title === 'Scam or fraud' &&
                            `${t('social.reportPost.option6')}`}
                          {item.title === 'Something else' &&
                            `${t('social.reportPost.option7')}`}
                        </label>
                        <Radio
                          crossOrigin={undefined}
                          value={item.type}
                          id={item.id}
                          name="type"
                          icon={<Icon />}
                          onChange={() => {
                            handleChangePost(item.id, item.type);
                            handleDisablePost(item);
                          }}
                          className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-[#DADADA] text-[#3AC4A0] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#3AC4A0] before:opacity-0 before:transition-opacity checked:border-[#3AC4A0] checked:before:bg-[#3AC4A0] hover:before:opacity-10"
                        />
                      </div>
                    );
                  })}
                </div>
              </DialogBody>
              <DialogFooter className="p-0">
                <Button
                  type="submit"
                  disabled={isDisabledPost}
                  className="rounded-full min-w-full capitalize font-semibold text-sm disabled:bg-[#BDBDBD] disabled:text-[#7C7C7C] bg-[#3AC4A0] text-white font-poppins"
                  onClick={() => {
                    handleOpenReportPost(null);
                    setSelectedPost(null);
                    handleVerifyReportPost('xs');
                  }}
                >
                  Continue
                </Button>
              </DialogFooter>
            </form>
          </Dialog>
          <Dialog
            dismiss={{
              outsidePress: false
            }}
            open={verifyReportPost === 'xs'}
            size={'xs'}
            handler={handleVerifyReportPost}
            className="text-center py-5 px-4 m-0 max-w-lg self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-2xl"
          >
            <DialogBody className="flex flex-col items-center p-0 mb-6 font-poppins">
              <Image src={post_report_photo} alt="reportPostFigure" />
              <p className="mt-6 text-base font-semibold text-[#262626]">
                {`${t('social.reportPost.success1')}`}
              </p>
              <p className="mt-2 text-base font-normal text-[#7C7C7C]">
                {`${t('social.reportPost.success2')}`}
              </p>
            </DialogBody>
            <DialogFooter className="p-0">
              <button
                className=" rounded-full min-w-full bg-[#3AC4A0] h-10 text-sm font-semibold capitalize text-white transition-all font-poppins"
                data-ripple-light="true"
                onClick={() => {
                  handleVerifyReportPost(null);
                }}
              >
                Done
              </button>
            </DialogFooter>
          </Dialog>
          {/* TODO: MODAL REPORT USER */}
          <Dialog
            className="p-5 m-0 max-w-lg self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-2xl"
            dismiss={{
              outsidePress: false
            }}
            open={reportUser === 'sm'}
            size={'sm'}
            handler={handleOpenReportUser}
          >
            <DialogHeader className="p-0 font-poppins">
              <div className="min-w-full flex items-center justify-between border-b">
                <div className="flex gap-2 flex-col">
                  <p className="text-lg font-semibold text-[#262626]">
                    {`${t('social.reportUser.text1')}`}
                  </p>
                  <p className="text-sm font-normal text-[#7C7C7C] mb-4">
                    {`${t('social.reportUser.text2')}`}
                  </p>
                </div>
                <div className="mb-4">
                  <Image
                    src={close}
                    alt="close"
                    onClick={() => {
                      handleChangeUser('', '');
                      handleOpenReportUser(null);
                      setSelectedUser(null);
                    }}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </DialogHeader>
            <DialogBody className="p-0 my-4 font-poppins">
              <p className="text-base font-semibold text-[#262626]">
                {`${t('social.reportUser.text3')}`}
              </p>
              <div className="flex flex-col text-[#262626] text-base font-normal">
                {listUser?.map((item, index) => {
                  return (
                    <div
                      className="flex items-center justify-between"
                      key={index}
                    >
                      <label
                        htmlFor={item.id}
                        className="cursor-pointer w-full"
                      >
                        {item.title ===
                          'A specific post that should not be on Seeds' &&
                          `${t('social.reportUser.text4')}`}
                        {item.title === 'Something about this account' &&
                          `${t('social.reportUser.text5')}`}
                      </label>
                      <Radio
                        crossOrigin={undefined}
                        value={item.type}
                        id={item.id}
                        name="type"
                        icon={<Icon />}
                        onChange={() => {
                          handleChangeUser(item.id, item.type);
                          handleDisableUser(item);
                        }}
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-[#DADADA] text-[#3AC4A0] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#3AC4A0] before:opacity-0 before:transition-opacity checked:border-[#3AC4A0] checked:before:bg-[#3AC4A0] hover:before:opacity-10"
                      />
                    </div>
                  );
                })}
              </div>
            </DialogBody>
            <DialogFooter className="p-0">
              <Button
                disabled={isDisabledUser}
                className="rounded-full min-w-full capitalize font-semibold text-sm disabled:bg-[#BDBDBD] disabled:text-[#7C7C7C] bg-[#3AC4A0] text-white font-poppins"
                onClick={() => {
                  handleOpenReportUser(null);
                  setSelectedUser(null);
                  handleVerifyReportUser('xs');
                }}
              >
                Continue
              </Button>
            </DialogFooter>
          </Dialog>
          <Dialog
            dismiss={{
              outsidePress: false
            }}
            open={verifyReportUser === 'xs'}
            size={'xs'}
            handler={handleVerifyReportUser}
            className="text-center py-5 px-4 m-0 max-w-lg self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-2xl"
          >
            <form onSubmit={handleSubmitReportUser}>
              <DialogBody className="flex flex-col items-center p-0 mb-6 font-poppins">
                <Image src={user_report_photo} alt="reportUserFigure" />
                <p className="mt-4 font-normal text-sm">
                  {`${t('social.reportUser.text6')}`}
                </p>
              </DialogBody>
              <DialogFooter className="p-0">
                <button
                  type="submit"
                  className=" rounded-full min-w-full bg-[#3AC4A0] h-10 text-sm font-semibold capitalize text-white transition-all mb-6 font-poppins"
                  data-ripple-light="true"
                  onClick={() => {
                    handleVerifyReportUser(null);
                  }}
                >
                  Report
                </button>
                <Button
                  variant="text"
                  color="white"
                  onClick={() => {
                    handleVerifyReportUser(null);
                  }}
                  className="min-w-full hover:bg-transparent focus:bg-transparent text-[#DD2525] text-sm font-semibold rounded-full capitalize p-0 font-poppins"
                >
                  <span>Cancel</span>
                </Button>
              </DialogFooter>
            </form>
          </Dialog>
          {/* TODO: BLOCK MODAL */}
          <Dialog
            dismiss={{
              outsidePress: false
            }}
            open={blockUser === 'xs'}
            size={'xs'}
            handler={handleOpenBlock}
            className="text-center py-5 px-4 m-0 max-w-lg self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-2xl"
          >
            <form onSubmit={handleSubmitBlockUser}>
              <DialogBody className="p-0 mb-6 font-poppins">
                <p className="text-base font-semibold leading-6 text-gray-900 p-0 mb-4">
                  {`Block ${
                    dataPost.owner !== undefined
                      ? (dataPost.owner?.name as string)
                      : ''
                  }`}
                </p>
                <p className="font-normal text-sm">
                  {`${t('social.blockUser.text')}`}
                </p>
              </DialogBody>
              <DialogFooter className="p-0">
                <button
                  type="submit"
                  className="rounded-full min-w-full bg-[#DD2525] h-10 text-sm font-semibold capitalize text-white transition-all mb-6 font-poppins"
                  data-ripple-light="true"
                  onClick={() => {
                    handleOpenBlock(null);
                  }}
                >
                  {`${t('social.blockUser.block')}`}
                </button>
                <Button
                  variant="text"
                  color="white"
                  onClick={() => {
                    handleOpenBlock(null);
                  }}
                  className="min-w-full hover:bg-transparent focus:bg-transparent text-[#3AC4A0] text-sm font-semibold rounded-full capitalize p-0 font-poppins"
                >
                  <span>Cancel</span>
                </Button>
              </DialogFooter>
            </form>
          </Dialog>
          {/* TODO: DELETE POST MODAL */}
          <Dialog
            dismiss={{
              outsidePress: false
            }}
            open={deletePost === 'xs'}
            size={'xs'}
            handler={handleOpenDelete}
            className="text-center p-5 m-0 max-w-full sm:max-w-xs self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl"
          >
            <form
              onSubmit={async () => {
                await handleSubmitDeletePost(dataPost.id);
              }}
            >
              <DialogBody className="p-0 mb-6 font-poppins">
                <p className="text-base font-semibold leading-6 text-gray-900 p-0 mb-4">
                  Delete Post
                </p>
                <p className="font-normal text-sm">
                  Are you sure want to delete this post?
                </p>
              </DialogBody>
              <DialogFooter className="p-0">
                <button
                  type="submit"
                  className="rounded-full min-w-full bg-[#DD2525] h-10 text-sm font-semibold capitalize text-white transition-all mb-6 font-poppins"
                  data-ripple-light="true"
                  onClick={() => {
                    handleOpenDelete(null);
                  }}
                >
                  Delete
                </button>
                <Button
                  variant="text"
                  color="white"
                  onClick={() => {
                    handleOpenDelete(null);
                  }}
                  className="min-w-full hover:bg-transparent focus:bg-transparent text-[#3AC4A0] text-sm font-semibold rounded-full capitalize p-0 font-poppins"
                >
                  <span>Cancel</span>
                </Button>
              </DialogFooter>
            </form>
          </Dialog>
        </>
      )}
    </>
  );
};

export default MoreOption;
