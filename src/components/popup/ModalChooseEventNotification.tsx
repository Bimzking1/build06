'use client';
// import Barcode from '@/assets/play/tournament/barcode.svg';
import { updateEventNotification } from '@/repository/discover.repository';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  eventId: string;
}

const ModalChooseEventNotification: React.FC<Props> = ({
  onClose,
  eventId
}) => {
  const { t } = useTranslation();
  const [isEmailChecked, setIsEmailChecked] = useState<boolean>(false);
  const [isWhatsAppChecked, setIsWhatsAppChecked] = useState<boolean>(false);
  const [notificationType, setNotificationType] = useState<string[]>([]);

  const handleCheckEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsEmailChecked(event.target.checked);
  };

  const handleCheckWhatsApp = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsWhatsAppChecked(event.target.checked);
  };

  useEffect(() => {
    const types: string[] = [];
    if (isEmailChecked) types.push('email');
    if (isWhatsAppChecked) types.push('whatsapp');
    setNotificationType(types);
  }, [isEmailChecked, isWhatsAppChecked]);

  const patchEventNotification = async (): Promise<void> => {
    try {
      const response = await updateEventNotification(notificationType, eventId);
      if (response === null) {
        toast.success(`Notification preference has been selected.`);
      }
    } catch (error) {
      toast.error(`Error selecting notification: ${error as string}`);
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/50 flex justify-start items-start"
    >
      <div className="flex justify-between">
        <Typography className="font-bold text-lg text-black">
          {t('seedsEvent.ticket.notificationMethod')}
        </Typography>
        <Image
          src={XIcon}
          alt="X"
          width={20}
          height={20}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>
      <div className="flex justify-start w-full text-[#7C7C7C] text-start text-sm mt-4">
        {t('seedsEvent.ticket.notificationModalMessage')}
      </div>
      <div className="py-2 px-4 w-full flex justify-between items-center border border-[#E0E0E0] rounded-lg my-4">
        <div>Email</div>
        <input
          type="checkbox"
          checked={isEmailChecked}
          onChange={handleCheckEmail}
          className="w-[18px] h-[18px]"
        />
      </div>
      <div className="py-2 px-4 w-full flex justify-between items-center border border-[#E0E0E0] rounded-lg">
        <div>WhatsApp</div>
        <input
          type="checkbox"
          checked={isWhatsAppChecked}
          onChange={handleCheckWhatsApp}
          className="w-[18px] h-[18px]"
        />
      </div>
      <Button
        onClick={async () => {
          await patchEventNotification();
        }}
        className="w-full text-sm md:text-base bg-seeds-button-green rounded-full mt-4"
      >
        OK
      </Button>
    </Modal>
  );
};

export default ModalChooseEventNotification;
