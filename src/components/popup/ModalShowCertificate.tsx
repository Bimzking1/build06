'use client';

import PDFViewerCertificate from '@/pages/homepage/event/[id]/section/pdf-viewer-certificate';
import { type CertificateI, type EventList } from '@/utils/interfaces/event.interface';
import Image from 'next/image';
import { DownloadIcon, XIconWhite } from 'public/assets/vector';
import { useState } from 'react';
import { MdOutlineEmail } from "react-icons/md";
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';
import ModalConfirmSendCertificate from './ModalConfirmSendCertificate';

interface Props {
  onClose: () => void;
  eventData?: EventList;
  eventName?: string;
  certificateData: CertificateI;
  file: string;
}

const ModalShowCertificate: React.FC<Props> = ({
  onClose,
  eventData,
  eventName,
  certificateData,
  file
}) => {
  const [showConfirmEmail, setShowConfirmEmail] = useState<boolean>(false);
  const modalDefaultClasses = `
    z-40 animate-slide-down fixed
    h-screen w-screen text-center
    shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white`
  ;

  const handleDownloadCertificate = (): void => {
    if (((certificateData?.pdf_data)?.length > 0) && ((certificateData?.event_name)?.length > 0)) {
      const byteCharacters = atob(certificateData.pdf_data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `E-Certificate - ${(certificateData?.event_name ?? 'Seeds Event')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('Invalid certificate data');
    }
  };

  return (
    <>
      {showConfirmEmail && (
        <ModalConfirmSendCertificate
          onClose={() => {
            setShowConfirmEmail(prev => !prev);
          }}
          ticketId={certificateData?.event_ticket_id ?? ''}
        />
      )}
      <Modal
        onClose={onClose}
        modalClasses={modalDefaultClasses}
        backdropClasses="z-30 fixed top-0 left-0 w-full h-screen bg-black/50 flex justify-start items-start"
      >
        <div className='w-screen h-screen flex flex-col'>
          <div className='bg-seeds-button-green h-fit'>
            <div className='py-4 font-semibold font-poppins text-white'>
              {eventData !== undefined ? eventData?.name ?? 'Seeds Event' : eventName}
            </div>
            <div className='px-8 pb-4'>
              <div className='flex justify-between items-center'>
                <div className='w-[24px] h-[24px] flex justify-center items-center'>
                  <Image
                    src={XIconWhite}
                    alt="Close"
                    width={100}
                    height={100}
                    onClick={onClose}
                    className="hover:scale-110 transition ease-out cursor-pointer w-full h-full"
                  />
                </div>
                <div className='flex gap-4 justify-center items-center'>
                  <MdOutlineEmail
                    onClick={() => { setShowConfirmEmail(true); }}
                    className='w-[24px] h-[24px] text-white hover:scale-110 transition ease-out cursor-pointer'
                  />
                  <div
                    onClick={handleDownloadCertificate}
                    className='flex justify-center items-center w-[24px] h-[24px]'
                  >
                    <Image
                      src={DownloadIcon}
                      alt="Download"
                      width={100}
                      height={100}
                      className="hover:scale-110 transition ease-out cursor-pointer w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            certificateData !== undefined &&
              <PDFViewerCertificate file={file}/>
          }
        </div>
      </Modal>
    </>
  );
};

export default ModalShowCertificate;
