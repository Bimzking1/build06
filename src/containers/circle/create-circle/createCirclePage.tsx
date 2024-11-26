import CCard from '@/components/CCard';
import { freeCircle, premiumCircle } from '@/constants/assets/icons';
import { type CircleInterface } from '@/pages/connect';
import { getCircle, getCircleCategories } from '@/repository/circle.repository';
import { getHashtag } from '@/repository/hashtag';
import LanguageContext from '@/store/language/language-context';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import ModalMembershipType from './modalMembershipType';

interface HashtagInterface {
  value: string;
  label: string;
}

const initialFilterHashtags = {
  page: 1,
  limit: 200,
  search: ''
};

interface OptionType {
  value: string;
  label: string;
}

const initialFilter = {
  search: '',
  limit: 20,
  page: 1,
  sort_by: '',
  type: 'my_circle'
};

const customStyles = {
  multiValue: (base: any, state: any) => ({
    ...base,
    backgroundColor: '#3AC4A0',
    color: 'white',
    borderRadius: '4px'
  }),
  multiValueLabel: (base: any, state: any) => ({
    ...base,
    color: 'white'
  }),
  input: (base: any, state: any) => ({
    ...base,
    border: 'none'
  }),
  placeholder: (base: any, state: any) => ({
    ...base,
    marginLeft: '4px'
  })
};

const formatOptionLabel = ({ label }: { label: string }): any => {
  return <div style={{ display: 'flex', alignItems: 'center' }}># {label}</div>;
};

const CreateCirclePage = ({
  formRequest,
  changeStep,
  change,
  uploadImage,
  changeHashtag,
  error,
  changeCategory
}: any): JSX.Element => {
  const [hashtags, setHashtag] = useState<HashtagInterface[]>();
  const [categories, setCategories] = useState<any[]>();
  const [selectedCategories, setSelectedCategories] = useState<
    MultiValue<string>
  >([]);
  const [limitReached, setLimitReached] = useState(false);
  const [openModalMembership, setOpenModalMembership] = useState(false);
  const [isAgree, setIsAgree] = useState();
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [isLoadingCircle, setIsLoadingCircle] = useState<boolean>(false);
  const [isNameDuplicate, setIsNameDuplicate] = useState<boolean>(false);
  const [circleNameArray, setCircleNameArray] = useState<CircleInterface[]>([]);

  useEffect(() => {
    fetchHashtags()
      .then()
      .catch(() => {});

    fetchCircleCategory()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    void fetchMyCircle();
  }, []);

  useEffect(() => {
    const isDuplicate = (): boolean => {
      return circleNameArray.some(item => item?.name === formRequest?.name);
    };
    setIsNameDuplicate(isDuplicate());
  }, [circleNameArray, formRequest]);

  const handleOpenModalMembership = (): void => {
    setOpenModalMembership(!openModalMembership);
  };

  const handleCheckBox = (event: any): void => {
    const target = event.target;
    const value = target.checked;

    setIsAgree(value);
  };

  const fetchHashtags = async (): Promise<void> => {
    //  Get API for Hashtags
    try {
      getHashtag(initialFilterHashtags)
        .then(res => {
          const mappedOptions: OptionType[] = res.data.map((item: any) => ({
            value: item.id,
            label: item.name
          }));

          setHashtag(mappedOptions);
        })
        .catch(err => {
          toast.error(`${err as string}`);
        });
    } catch (error) {
      toast.error(`Error fetching circle data: ${error as string}`);
    }
  };

  const fetchCircleCategory = async (): Promise<void> => {
    // Get API for Categories option
    try {
      getCircleCategories(initialFilterHashtags)
        .then(res => {
          const mappedOptions: OptionType[] = res.data.map((item: any) => ({
            value: item.id,
            label: item.category
          }));

          setCategories(mappedOptions);
        })
        .catch(err => {
          toast.error(`${err as string}`);
        });
    } catch (error) {
      toast.error(`Error fetching circle data: ${error as string}`);
    }
  };

  const fetchMyCircle = async (): Promise<void> => {
    try {
      setIsLoadingCircle(true);
      const response = await getCircle({ ...initialFilter });
      const newData = response.data !== null ? response.data : [];
      setCircleNameArray(newData);
    } catch (error) {
      toast.error(`Error fetching circle data: ${error as string}`);
    } finally {
      setIsLoadingCircle(false);
    }
  };
  const handleCategoryChange = (newCategories: MultiValue<string>): void => {
    // Handle Category option, set limit to just 5 options
    if (newCategories.length <= 5) {
      setSelectedCategories(newCategories);
      setLimitReached(false);
    } else {
      setSelectedCategories(newCategories.slice(0, 5));
      setLimitReached(true);
    }
  };

  return (
    <div>
      {formRequest !== undefined && !isLoadingCircle && (
        <>
          <ModalMembershipType
            openModal={openModalMembership}
            handleOpenModal={handleOpenModalMembership}
            change={change}
            formRequest={formRequest}
          />
          <form>
            <div className="mb-4">
              <h6 className="mb-4 text-center text-lg font-poppins font-semibold">
                {t('circle.create.title')}
              </h6>
            </div>
            <div className="flex items-center justify-center rounded-xl">
              <label className="relative w-full h-44">
                <Image
                  height={0}
                  width={0}
                  src={formRequest?.cover}
                  alt="Add Cover"
                  sizes="100vw"
                  className="object-cover w-full h-full"
                />

                {formRequest.cover === '' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] text-[#3AC4A0] bg-[#DCFCE4]">
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Cover
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  name="cover"
                  onChange={uploadImage}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
            </div>
            <div className="absolute z-10 flex items-center justify-center top-52 left-[43%] xl:left-[45%]">
              <label className="relative rounded-full w-24 h-24 overflow-hidden">
                <Image
                  height={0}
                  width={0}
                  src={formRequest?.avatar}
                  alt="Add Cover"
                  sizes="100vw"
                  className="object-cover w-full h-full"
                />
                {formRequest.avatar === '' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] text-[#3AC4A0] bg-[#DCFCE4]">
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Image
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  name="avatar"
                  onChange={uploadImage}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
            </div>
            <CCard className="p-9 border-none rounded-none shadow-none bg-white">
              <div className="mb-10 pt-10 bg-white">
                <div className="mb-8">
                  <label className="font-semibold text-base text-[#262626]">
                    {t('circle.create.name.label')}
                  </label>
                  <Input
                    variant="static"
                    color="green"
                    name="name"
                    onChange={change}
                    value={formRequest?.name}
                    placeholder={
                      languageCtx.language === 'EN'
                        ? 'Circle Name'
                        : 'Nama Circle'
                    }
                  />
                  {isNameDuplicate && (
                    <div className="mt-1 text-[#DD2525] text-sm">
                      {t('circle.create.name.duplicate1')}{' '}
                      {formRequest?.name ?? ''}{' '}
                      {t('circle.create.name.duplicate2')}
                    </div>
                  )}
                  {error.name !== null ? (
                    <Typography color="red" className="text-xs mt-2">
                      {error.name}
                    </Typography>
                  ) : null}
                </div>

                <div className="mb-8">
                  <label className="font-semibold text-base text-[#262626]">
                    {t('circle.create.hashtag.label')}
                  </label>
                  <CreatableSelect
                    isMulti
                    onChange={changeHashtag}
                    options={hashtags}
                    // value={formRequest.hashtags}
                    styles={customStyles}
                    formatOptionLabel={formatOptionLabel}
                    placeholder="#"
                  />
                  {error.hashtags !== null ? (
                    <Typography color="red" className="text-xs mt-2">
                      {error.hashtags}
                    </Typography>
                  ) : null}
                </div>

                <div className="mb-8">
                  <label className="font-semibold text-base text-[#262626]">
                    Categories
                  </label>
                  <CreatableSelect
                    isMulti
                    onChange={handleCategoryChange}
                    options={categories}
                    value={selectedCategories}
                    placeholder="Choose Categories"
                  />
                  {error.hashtags !== null ? (
                    <Typography color="red" className="text-xs mt-2">
                      {error.category}
                    </Typography>
                  ) : null}
                  {limitReached && (
                    <Typography color="red" className="text-xs mt-2">
                      Maximum choose 5 categories!
                    </Typography>
                  )}
                </div>

                <div className="mb-8">
                  <label className="font-semibold text-base text-[#262626]">
                    {t('circle.create.description.label')}
                  </label>
                  <Input
                    variant="static"
                    color="green"
                    name="description"
                    className="w-full"
                    onChange={change}
                    value={formRequest.description}
                    placeholder={
                      languageCtx.language === 'EN'
                        ? 'Type Description'
                        : 'Tuliskan Deskripsi'
                    }
                  />
                  {error.description !== null ? (
                    <Typography color="red" className="text-xs mt-2">
                      {error.description}
                    </Typography>
                  ) : null}
                </div>

                <div className="mb-8">
                  <label className="font-semibold text-base text-[#262626]">
                    {t('circle.create.rules.label')}
                  </label>
                  <Input
                    variant="static"
                    color="green"
                    name="description_rules"
                    onChange={change}
                    value={formRequest.description_rules}
                    placeholder={
                      languageCtx.language === 'EN'
                        ? 'Type rules'
                        : 'Tuliskan Peraturan'
                    }
                  />
                  {error.description_rules !== null ? (
                    <Typography color="red" className="text-xs mt-2">
                      {error.description_rules}
                    </Typography>
                  ) : null}
                </div>

                <Card color="white" shadow={false} className="w-full border-2">
                  <CardBody className="p-3 inline-block h-auto">
                    <div className="flex flex-row">
                      {formRequest.membership_type === 'free' ? (
                        <>
                          <Avatar
                            size="md"
                            variant="circular"
                            src={freeCircle.src}
                            alt="tania andrew"
                          />

                          <div className="flex w-full ml-5 flex-col gap-0.5">
                            <Typography className="font-semibold text-base text-[#262626]">
                              {t('circle.typePopUp.option.free.title')}
                            </Typography>
                            <Typography className="font-normal text-sm text-[#7C7C7C]">
                              {t('circle.typePopUp.option.free.subtitle')}
                            </Typography>
                          </div>
                        </>
                      ) : formRequest.membership_type === 'premium' ? (
                        <>
                          <Avatar
                            size="md"
                            variant="circular"
                            src={premiumCircle.src}
                            alt="tania andrew"
                          />

                          <div className="flex w-full ml-5 flex-col gap-0.5">
                            <Typography className="font-semibold text-base text-[#262626]">
                              {t('circle.typePopUp.option.premium.title')}
                            </Typography>
                            <Typography className="font-normal text-sm text-[#7C7C7C]">
                              {t('circle.typePopUp.option.premium.subtitle')}
                            </Typography>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex w-full ml-5 flex-col gap-0.5">
                            <Typography className="font-semibold text-base text-[#262626]">
                              {t('circle.create.type.label')}
                            </Typography>
                            <Typography className="font-normal text-sm text-[#7C7C7C]">
                              {t('circle.create.type.placeholder')}
                            </Typography>
                          </div>
                        </>
                      )}
                      <div className="items-end">
                        <Button
                          className="text-md font-normal bg-white text-black rounded-full shadow-none"
                          onClick={handleOpenModalMembership}
                        >
                          {'>'}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                {error.membership_type !== null ? (
                  <Typography color="red" className="text-xs mt-2">
                    {error.membership_type}
                  </Typography>
                ) : null}
              </div>
              <div className="text-center mx-8 pb-2">
                <input
                  type="checkbox"
                  name="tickBox"
                  className="mr-3"
                  value={isAgree}
                  defaultChecked={false}
                  onChange={handleCheckBox}
                  id="customCheck2"
                />
                <label
                  htmlFor="customCheck2"
                  className="font-normal text-xs text-[#262626]"
                >
                  I agree with the
                </label>
                <a
                  onClick={() => changeStep('TnC')}
                  className="font-normal text-xs underline ml-1 text-[#3C49D6]"
                >
                  Terms and Conditions
                </a>

                {isAgree === true && !isNameDuplicate ? (
                  <Button
                    className="w-full bg-seeds-button-green mt-10 rounded-full capitalize"
                    onClick={() =>
                      changeStep(
                        formRequest.membership_type === 'free'
                          ? 'membership'
                          : 'premium_choice'
                      )
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-seeds-button-green mt-10 rounded-full capitalize"
                    disabled={true}
                  >
                    Continue
                  </Button>
                )}
              </div>
            </CCard>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateCirclePage;
