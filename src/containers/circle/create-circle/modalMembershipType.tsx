import { freeCircle, premiumCircle } from '@/constants/assets/icons';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Radio,
  Typography
} from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

const ModalMembershipType = ({
  openModal,
  handleOpenModal,
  change,
  formRequest
}: any): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Dialog size="sm" open={openModal} handler={handleOpenModal}>
      {formRequest !== undefined && (
        <>
          <DialogHeader className="justify-end">
            <IconButton
              color="blue-gray"
              size="sm"
              variant="text"
              onClick={handleOpenModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </DialogHeader>
          <DialogBody>
            <Typography
              className="font-semibold text-base text-center"
              color="blue-gray"
            >
              {t('circle.typePopUp.title')}
            </Typography>
            <Typography className="font-normal text-sm text-center mb-5 text-[#7C7C7C]">
              {t('circle.typePopUp.subtitle')}
            </Typography>

            <Card color="white" shadow={false} className="w-full border-2 mb-5">
              <CardBody className="p-3 inline-block h-auto">
                <div className="flex flex-row">
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
                  <div className="items-end">
                    {formRequest.membership_type === 'free' ? (
                      <Radio
                        name="membership_type"
                        value="free"
                        onChange={change}
                        checked={true}
                      />
                    ) : (
                      <Radio
                        name="membership_type"
                        value="free"
                        onChange={change}
                        checked={false}
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card color="white" shadow={false} className="w-full border-2">
              <CardBody className="p-3 inline-block h-auto">
                <div className="flex flex-row">
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
                  <div className="items-end">
                    {formRequest.membership_type === 'premium' ? (
                      <Radio
                        name="membership_type"
                        value="premium"
                        onChange={change}
                        checked={true}
                      />
                    ) : (
                      <Radio
                        name="membership_type"
                        value="premium"
                        onChange={change}
                        checked={false}
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </DialogBody>
          <DialogFooter>
            <Button
              className="w-full bg-seeds-button-green mt-2 rounded-full capitalize"
              onClick={handleOpenModal}
            >
              {t('circle.typePopUp.button')}
            </Button>
          </DialogFooter>
        </>
      )}
    </Dialog>
  );
};

export default ModalMembershipType;
