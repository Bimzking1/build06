import FinalModalCircle from '@/components/circle/FinalModalCircle';
import {
  failedCircle,
  freeCircle,
  premiumCircle
} from '@/constants/assets/icons';
import { updateCircle } from '@/repository/circle.repository';
import { getHashtag } from '@/repository/hashtag';
import LanguageContext from '@/store/language/language-context';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  Typography
} from '@material-tailwind/react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';
import CircleMembershipFeePage from '../create-circle/circleMembershipFeePage';
import CirclePremiumChoicePage from '../create-circle/circlePremiumChoicePage';
import MembershipPage from '../create-circle/membershipPage';
import ModalMembershipType from '../create-circle/modalMembershipType';
import SuccessPage from '../create-circle/successPage';
import TermConditionPage from '../create-circle/termConditionPage';

interface HashtagInterface {
  value: string;
  label: string;
}

interface OptionType {
  value: string;
  label: string;
}

const initialFilterHashtags = {
  page: 1,
  limit: 200,
  search: ''
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

interface props {
  dataCircle: FormRequestInterface;
  circleId: string;
}

interface FormRequestInterface {
  name: string;
  avatar: string;
  cover: string;
  description: string;
  description_rules: string;
  type: string;
  premium_fee: number;
  memberships: any[];
  hashtags: OptionType[];
  membership_type: string;
  category: string;
}

const initialFormRequest = {
  name: '',
  avatar: '',
  cover: '',
  description: '',
  description_rules: '',
  type: 'free',
  premium_fee: 0,
  memberships: [],
  hashtags: [],
  membership_type: '',
  category: ''
};

const EditCircle: React.FC<props> = ({ dataCircle, circleId }) => {
  const [formRequest, setFormRequest] =
    useState<FormRequestInterface>(initialFormRequest);
  const [hashtags, setHashtag] = useState<HashtagInterface[]>();
  const [openModalMembership, setOpenModalMembership] = useState(false);
  const [isAgree, setIsAgree] = useState();
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [step, setStep] = useState('');
  const [isLoadingSubmit, setIsloadingSubmit] = useState(false);

  const handleOpenModalMembership = (): void => {
    setOpenModalMembership(!openModalMembership);
  };

  const handleChangeStep = (value: string): void => {
    setStep(value);
  };

  const fetchHashtags = async (): Promise<void> => {
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
          console.log(err);
        });
    } catch (error: any) {
      console.error('Error fetching circle data:', error.message);
    }
  };

  const handleChangeValue = (event: any): void => {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    if (name === 'memberships') {
      setFormRequest(prevState => ({
        ...prevState,
        [name]: [...formRequest.memberships, JSON.parse(value)]
      }));
    } else if (name === 'premium_fee') {
      value = parseInt(value);
      setFormRequest(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setFormRequest(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleChangeValueHashtag = (value: any): void => {
    setFormRequest(prevState => ({
      ...prevState,
      hashtags: value
    }));
  };

  const handleCheckBox = (event: any): void => {
    const target = event.target;
    const value = target.checked;

    setIsAgree(value);
  };

  const removeMemberships = (index: number): void => {
    const newData = [...formRequest.memberships];
    newData.splice(index, 1);

    setFormRequest(prevState => ({
      ...prevState,
      memberships: newData
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setIsloadingSubmit(true);
      const mappedOptions: any[] = formRequest.hashtags?.map(
        (item: OptionType) => ({
          id: item.value,
          name: item.label
        })
      );

      formRequest.hashtags = mappedOptions;
      formRequest.memberships = formRequest.memberships.map(user => user.id);

      updateCircle(formRequest, circleId)
        .then(res => {
          console.log('response post = ', res);
          window.location.reload();
        })
        .catch(err => {
          setIsloadingSubmit(false);
          console.log(err);
          setStep('failed');
        });
    } catch (error: any) {
      setIsloadingSubmit(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  useEffect(() => {
    void fetchHashtags();

    const mappedOptions: OptionType[] = dataCircle.hashtags?.map(
      (item: any) => ({
        value: item.id,
        label: item.name
      })
    );

    setFormRequest(prevState => ({
      ...prevState,
      avatar: dataCircle.avatar,
      cover: dataCircle.cover,
      description: dataCircle.description,
      description_rules: dataCircle.description_rules,
      name: dataCircle.name,
      hashtags: mappedOptions,
      category: dataCircle.category,
      membership_type: dataCircle.type,
      premium_fee: dataCircle.premium_fee,
      type: dataCircle.type
    }));
  }, []);

  return (
    <div className="overflow-hidden">
      <ModalMembershipType
        openModal={openModalMembership}
        handleOpenModal={handleOpenModalMembership}
        change={handleChangeValue}
        formRequest={formRequest}
      />
      <Typography className="text-2xl font-semibold text-center">
        Edit Circle
      </Typography>

      {step === 'TnC' ? (
        <TermConditionPage changeStep={handleChangeStep} />
      ) : step === 'membership' ? (
        <MembershipPage
          formRequest={formRequest}
          changeStep={handleChangeStep}
          change={handleChangeValue}
          removeMember={removeMemberships}
          submit={handleSubmit}
          isLoadingSubmit={isLoadingSubmit}
        />
      ) : step === 'premium_choice' ? (
        <CirclePremiumChoicePage
          change={handleChangeValue}
          formRequest={formRequest}
          changeStep={handleChangeStep}
        />
      ) : step === 'membership_fee' ? (
        <CircleMembershipFeePage
          formRequest={formRequest}
          changeStep={handleChangeStep}
          change={handleChangeValue}
        />
      ) : step === 'success' ? (
        <SuccessPage />
      ) : step === 'failed' ? (
        <FinalModalCircle
          title="Failed!"
          subtitle="Sorry, the new Circle creation has been failed. Please try again!"
          button="Try Again"
          imageUrl={failedCircle.src}
          handleOpen={handleChangeStep}
          error={true}
        />
      ) : (
        <>
          <div className="mb-8">
            <label className="font-semibold text-base text-[#262626]">
              {t('circle.create.name.label')}
            </label>
            <Input
              variant="static"
              color="green"
              name="name"
              onChange={handleChangeValue}
              value={formRequest?.name}
              placeholder={
                languageCtx.language === 'EN' ? 'Circle Name' : 'Nama Circle'
              }
            />
          </div>

          <div className="mb-8">
            <label className="font-semibold text-base text-[#262626]">
              {t('circle.create.hashtag.label')}
            </label>
            <CreatableSelect
              isMulti
              onChange={handleChangeValueHashtag}
              options={hashtags}
              value={formRequest.hashtags}
              styles={customStyles}
              formatOptionLabel={formatOptionLabel}
              placeholder="#"
            />
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
              onChange={handleChangeValue}
              value={formRequest.description}
              placeholder={
                languageCtx.language === 'EN'
                  ? 'Type Description'
                  : 'Tuliskan Deskripsi'
              }
            />
          </div>

          <div className="mb-8">
            <label className="font-semibold text-base text-[#262626]">
              {t('circle.create.rules.label')}
            </label>
            <Input
              variant="static"
              color="green"
              name="description_rules"
              onChange={handleChangeValue}
              value={formRequest.description_rules}
              placeholder={
                languageCtx.language === 'EN'
                  ? 'Type rules'
                  : 'Tuliskan Peraturan'
              }
            />
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
                        Free
                      </Typography>
                      <Typography className="font-normal text-sm text-[#7C7C7C]">
                        Create an Investment Circle easily and for free
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
                        Premium
                      </Typography>
                      <Typography className="font-normal text-sm text-[#7C7C7C]">
                        Create a Premium Circle for various benefits
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
          <div className="text-center mx-8 mt-4 pb-2">
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
            <a className="font-normal text-xs underline ml-1 text-[#3C49D6]">
              Terms and Conditions
            </a>

            {isAgree === true ? (
              <Button
                onClick={() => {
                  handleChangeStep(
                    formRequest.membership_type === 'free'
                      ? 'membership'
                      : 'premium_choice'
                  );
                }}
                className="w-full bg-seeds-button-green mt-10 rounded-full capitalize"
              >
                Continue
              </Button>
            ) : (
              <Button
                disabled={true}
                className="w-full bg-seeds-button-green mt-10 rounded-full capitalize"
              >
                Continue
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EditCircle;
