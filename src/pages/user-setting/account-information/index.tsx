import AvatarList from '@/components/profile/editProfile/AvatarList';
import BirthDateCalender from '@/components/profile/editProfile/BirthDateCalender';
import ModalCrop from '@/components/profile/editProfile/ModalCrop';
import ModalImage from '@/components/profile/editProfile/ModalImage';
import SettingCommonInput from '@/components/setting/accountInformation/SettingCommonInput';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { checkSeedsTag } from '@/repository/auth.repository';
import { postCloud } from '@/repository/cloud.repository';
import { fetchUserData, updateUser } from '@/store/redux/features/user';
import { useAppDispatch, useAppSelector } from '@/store/redux/store';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IForm {
  name: string;
  seedsTag: string;
  email: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
}

const AccountInformation: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { dataUser } = useAppSelector(state => state.user);
  const maxLengthBio = 50;
  const [select, setSelect] = useState(0);
  const [updateAvatar, setAvatar] = useState<File | null>(null);
  const [birthDate, setBirthDate] = useState(new Date());
  const [error, setError] = useState(false);
  const [errorCheck, setErrorCheck] = useState(false);
  const [form, setForm] = useState<IForm>({
    name: dataUser.name,
    seedsTag: dataUser.seedsTag,
    email: dataUser.email,
    avatar: dataUser.avatar,
    bio: dataUser.bio,
    birthDate: dataUser.birthDate,
    phone: dataUser.phoneNumber
  });

  const [openImage, setOpenImage] = useState(false);
  const handleOpenImage = (): void => {
    setOpenImage(!openImage);
  };
  const [openCrop, setOpenCrop] = useState(false);
  const handleOpenCrop = (): void => {
    setOpenCrop(!openCrop);
  };

  const handleFileChange = (e: any): void => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file !== null && file !== undefined) {
      setForm({ ...form, avatar: URL.createObjectURL(file) });
    }
    setOpenImage(!openImage);
  };
  const handleAvatar = (selectedAvatar: any): void => {
    setForm({ ...form, avatar: selectedAvatar });
    setSelect(0);
  };

  const changeData = async (e: any): Promise<void> => {
    setError(false);
    setErrorCheck(false);
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);
    const regex = /[^a-zA-Z0-9]/g;
    setError(regex.test(updatedForm.seedsTag));
    try {
      await checkSeedsTag(updatedForm.seedsTag);
    } catch (error: any) {
      if (dataUser.seedsTag !== updatedForm.seedsTag) {
        setErrorCheck(true);
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      let updatedForm: any = { ...form };

      if (updateAvatar !== undefined && updateAvatar !== null) {
        const { path: cloudResponse } = await postCloud({
          file: updateAvatar,
          type: 'OTHER_URL'
        });
        updatedForm = {
          ...updatedForm,
          avatar: cloudResponse
        };
      }
      updatedForm = {
        ...updatedForm,
        birthDate: new Date(birthDate).toISOString()
      };
      await dispatch(updateUser(updatedForm));
      await dispatch(fetchUserData());
      await router.push('/my-profile');
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  };
  return (
    <PageGradient defaultGradient className="w-full flex justify-center">
      <Card
        className={`${
          select === 0 ? 'flex' : 'hidden'
        } w-[947px] md:p-5 bg-transparent shadow-none md:bg-white md:shadow-md`}
      >
        <div className="relative flex items-center my-5 bg-white w-full py-8 md:p-0">
          <Image
            src={ArrowBackwardIcon}
            alt="arrow-backward-icon"
            className="absolute left-4 md:left-0 cursor-pointer"
            onClick={() => {
              router.back();
            }}
          />
          <Typography className="!absolute right-1/2 translate-x-1/2 font-poppins font-bold text-[#262626] text-base">
            {t('setting.setting.accountInfo.title')}
          </Typography>
          <Button
            onClick={handleSubmit}
            className="!absolute right-4 md:right-0 font-poppins font-semibold text-[#3AC4A0] text-base bg-transparent shadow-none hover:shadow-none capitalize p-0 disabled:text-[#7C7C7C]"
            disabled={error || errorCheck}
          >
            {t('button.label.done')}
          </Button>
        </div>
        <div className="flex flex-col gap-3 bg-white">
          <div className="flex flex-col justify-center items-center gap-2">
            {updateAvatar !== undefined && updateAvatar !== null ? (
              <img
                src={URL.createObjectURL(updateAvatar)}
                alt="avatar"
                className="w-[108px] h-[108px] rounded-full"
              />
            ) : (
              <img
                src={form?.avatar}
                alt="avatar"
                className="w-[108px] h-[108px] rounded-full"
              />
            )}
            <Button
              onClick={handleOpenImage}
              className="text-[#3AC4A0] text-xs font-semibold font-poppins cursor-pointer bg-transparent hover:shadow-none shadow-none capitalize"
            >
              {t('setting.setting.accountInfo.edit')}
            </Button>
            <ModalImage
              openImage={openImage}
              handleOpenImage={handleOpenImage}
              handleFileChange={handleFileChange}
              setSelect={setSelect}
            />
            {updateAvatar !== undefined && (
              <ModalCrop
                openCrop={openCrop}
                handleOpenCrop={handleOpenCrop}
                updateAvatar={updateAvatar}
              />
            )}
          </div>
          <div className="flex flex-col justify-center items-center gap-4 w-full p-4 md:pb-0">
            <SettingCommonInput
              divClassName="w-full"
              label={`${t('setting.setting.accountInfo.name')}`}
              name="name"
              value={form?.name}
              onChange={changeData}
              className="!text-[#7C7C7C] !text-base !font-poppins !font-normal"
              maxLength={maxLengthBio}
            />
            <SettingCommonInput
              divClassName="relative flex flex-col w-full"
              extraClassesTop={
                <Typography
                  className={`${
                    error || errorCheck ? 'text-red-600' : 'text-[#7C7C7C]'
                  } absolute  p-0 pb-[7px] pt-[14px] text-base font-poppins font-normal cursor-default`}
                >
                  @
                </Typography>
              }
              label="SeedsTag"
              name="seedsTag"
              value={form?.seedsTag}
              onChange={changeData}
              className={`${
                error || errorCheck ? 'text-red-600' : '!text-[#7C7C7C]'
              } !text-base !font-poppins !font-normal pl-[20px]`}
              error={error || errorCheck}
              extraClassesBottom={
                <Typography
                  className={`${
                    error || errorCheck ? 'flex' : 'hidden'
                  } text-xs font-poppins font-normal text-red-600`}
                >
                  {error ? (
                    t('authRegister.authPersonalData.validation.regex')
                  ) : errorCheck ? (
                    t('authRegister.authPersonalData.validation.seedsTag')
                  ) : (
                    <br />
                  )}
                </Typography>
              }
            />
            <BirthDateCalender
              wrapperClassName="w-full"
              birthDate={birthDate}
              setBirthDate={setBirthDate}
            />
            <SettingCommonInput
              divClassName="w-full"
              label="Bio"
              name="bio"
              value={form?.bio}
              onChange={changeData}
              className="!text-[#7C7C7C] !text-base !font-poppins !font-normal"
              maxLength={maxLengthBio}
              extraClassesBottom={
                <Typography className="font-light font-poppins text-base text-[#3C49D6]">
                  {form.bio.length}/{maxLengthBio}
                </Typography>
              }
            />
          </div>
        </div>
      </Card>
      <AvatarList
        setSelect={setSelect}
        className={select === 2 ? 'flex' : 'hidden'}
        handleAvatar={handleAvatar}
      />
    </PageGradient>
  );
};

export default withAuth(AccountInformation);
