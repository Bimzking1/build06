import AuthGoogle from '@/assets/auth/AuthGoogle.png';
import DropdownPhone from '@/assets/my-profile/editProfile/DropdownPhone.svg';
import AssociatedAccountButton from '@/components/setting/accountSecurityCenter/AssociatedAccountButton';
import FormModalDelete from '@/components/setting/accountSecurityCenter/FormModalDelete';
import FormModalMail from '@/components/setting/accountSecurityCenter/FormModalMail';
// import FormModalMail from '@/components/setting/accountSecurityCenter/FormModalMail';
import FormModalNumber from '@/components/setting/accountSecurityCenter/FormModalNumber';
import ModalPrevent from '@/components/setting/accountSecurityCenter/ModalPrevent';
import SecuritySettingForm from '@/components/setting/accountSecurityCenter/SecuritySettingForm';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import countries from '@/constants/countries.json';
import withAuth from '@/helpers/withAuth';
import { fetchUserData } from '@/store/redux/features/user';
import { useAppDispatch, useAppSelector } from '@/store/redux/store';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CountryCodeInfo {
  name: string;
  flag: string;
  code: string;
  dialCode: string;
}

const getCountry = (phone: string): CountryCodeInfo | undefined =>
  countries.find(code => {
    const dialCode = code?.dialCode.replace('+', '');
    return phone?.replace('+', '').slice(0, dialCode?.length) === dialCode;
  });

const AccountSecurityCenter: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { dataUser } = useAppSelector(state => state.user);
  const [countryInfo, setCountryInfo] = useState<CountryCodeInfo | undefined>();
  const [country, setCountry] = useState(101);
  const [openNumber, setOpenNumber] = useState(false);
  const [openMail, setOpenMail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openPreventPass, setOpenPreventPass] = useState(false);
  const [openPreventUnlink, setOpenPreventUnlink] = useState(false);

  const handleOpenDelete = (): void => {
    setOpenDelete(!openDelete);
  };
  const handleOpenMail = (): void => {
    setOpenMail(!openMail);
  };
  const handleOpenPassword = (): void => {
    setOpenPassword(!openPassword);
  };
  const handleOpenPreventUnlink = (): void => {
    setOpenPreventUnlink(!openPreventUnlink);
  };
  const handleOpenPreventPass = (): void => {
    setOpenPreventPass(!openPreventPass);
  };
  const handleOpenNumber = (): void => {
    setOpenNumber(!openNumber);
  };
  useEffect(() => {
    setCountryInfo(getCountry(dataUser.phoneNumber));
  }, [dataUser.phoneNumber]);
  useEffect(() => {
    dispatch(fetchUserData())
      .then()
      .catch(() => {});
  }, []);
  return (
    <PageGradient
      defaultGradient
      className="w-full flex flex-col justify-center gap-4"
    >
      {/* TODO: MODAL SESSION */}
      <FormModalMail
        open={openMail}
        handleOpen={handleOpenMail}
        emailData={dataUser.email}
        setOpenMail={setOpenMail}
        openMail={openMail}
      />
      <FormModalNumber
        open={openNumber}
        handleOpen={handleOpenNumber}
        phoneData={dataUser.phoneNumber}
        country={country}
        setCountry={setCountry}
      />
      <FormModalDelete open={openDelete} handleOpen={handleOpenDelete} />
      <ModalPrevent
        open={openPreventPass}
        handleOpen={handleOpenPreventPass}
        text={t('setting.setting.accountSecure.prevent.password')}
      />
      <ModalPrevent
        open={openPreventUnlink}
        handleOpen={handleOpenPreventUnlink}
        text={t('setting.setting.accountSecure.prevent.unlink')}
      />
      {/* TODO: END OF MODAL SESSION */}
      <Card className="flex flex-col justify-center items-center gap-6 w-full shadow-none sm:shadow-md md:shadow-none p-4 lg:py-10 lg:px-32">
        <Typography className="font-poppins font-semibold text-base text-[#262626] self-start">
          {t('setting.setting.accountSecure.titleCard1')}
        </Typography>
        <SecuritySettingForm
          onClick={handleOpenMail}
          form={dataUser.email}
          textBlank={t('setting.setting.accountSecure.blank3Card1')}
          label={t('setting.setting.accountSecure.label3Card1')}
        />
        <SecuritySettingForm
          onClick={handleOpenNumber}
          form={dataUser.phoneNumber.replace(
            `${countryInfo?.dialCode.replace('+', '') as string}`,
            ''
          )}
          textBlank={t('setting.setting.accountSecure.blank1Card1')}
          label={t('setting.setting.accountSecure.label1Card1')}
          extraChildren={
            <>
              <img
                src={
                  countryInfo !== undefined
                    ? `https://flagcdn.com/${countryInfo?.code.toLowerCase()}.svg`
                    : `https://flagcdn.com/${countries[
                        country
                      ].code.toLowerCase()}.svg`
                }
                alt={countryInfo?.name ?? countries[country].name}
                className="h-4 w-7 object-cover"
              />
              <Typography className="text-[#7C7C7C] text-base font-poppins font-normal">
                {countryInfo?.dialCode ?? countries[country].dialCode}
              </Typography>
              <Image src={DropdownPhone} alt="DropdownPhone" />
            </>
          }
        />

        <SecuritySettingForm
          onClick={async () => {
            dataUser.phoneNumber === ''
              ? handleOpenPreventPass()
              : dataUser.isPasswordExists
              ? await router.push('/auth/change-password')
              : await router.push('/auth/create-password');
          }}
          form={
            dataUser.isPasswordExists ? (
              <div className="flex gap-2 pt-2">
                <div className="w-2 h-2 rounded-full bg-[#7C7C7C]"></div>
                <div className="w-2 h-2 rounded-full bg-[#7C7C7C]"></div>
                <div className="w-2 h-2 rounded-full bg-[#7C7C7C]"></div>
                <div className="w-2 h-2 rounded-full bg-[#7C7C7C]"></div>
                <div className="w-2 h-2 rounded-full bg-[#7C7C7C]"></div>
                <div className="w-2 h-2 rounded-full bg-[#7C7C7C]"></div>
              </div>
            ) : (
              ''
            )
          }
          textBlank={t('setting.setting.accountSecure.blank2Card1')}
          label={t('setting.setting.accountSecure.label2Card1')}
        />
      </Card>
      <Card className="flex flex-col justify-center items-center gap-6 w-full shadow-none sm:shadow-md md:shadow-none p-4 lg:py-10 lg:px-32">
        <Typography className="font-poppins font-semibold text-base text-[#262626] self-start">
          {t('setting.setting.accountSecure.titleCard2')}
        </Typography>
        <AssociatedAccountButton
          image={AuthGoogle}
          imageClassName="w-12"
          alternative="Google Account"
          text="Google Account"
          provider="google"
          handleOpen={handleOpenPreventUnlink}
          openPassword={openPassword}
          handleOpenPassword={handleOpenPassword}
        />
      </Card>
      <Card className="flex flex-col gap-6 w-full shadow-none sm:shadow-md md:shadow-none p-4 lg:py-10 lg:px-32">
        <div className="flex flex-col gap-2">
          <Typography className="font-poppins font-semibold text-base text-[#262626]">
            {t('setting.setting.accountSecure.titleCard3')}
          </Typography>
          <Typography className="font-poppins font-normal text-sm text-[#7C7C7C]">
            {t('setting.setting.accountSecure.descriptionCard3')}
          </Typography>
        </div>
        <Button
          onClick={handleOpenDelete}
          className="w-fit py-2.5 px-5 capitalize font-poppins font-semibold text-sm text-[#DD2525] rounded-full bg-transparent border border-[#DD2525]"
        >
          {t('setting.setting.accountSecure.titleCard3')}
        </Button>
      </Card>
    </PageGradient>
  );
};

export default withAuth(AccountSecurityCenter);
