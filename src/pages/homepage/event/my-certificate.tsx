/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import IconNoData from '@/assets/play/tournament/noData.svg';
import AssetPagination from '@/components/AssetPagination';
import ModalShowCertificate from '@/components/popup/ModalShowCertificate';
import withAuth from '@/helpers/withAuth';
import {
  type EventListParams,
  getCertificateById,
  getMyCertificate
} from '@/repository/discover.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type CertificateI, type MyCertificateI } from '@/utils/interfaces/event.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EventIcon, MyCertificateIcon } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from "react-icons/io";
import { toast } from 'react-toastify';
import { initialCertificate } from './[id]';

interface CertificateMetadataI {
  total: number
  current_page: number
  limit: number
  total_page: number
}

const MyCertificate: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState<boolean>(false);
  const [certificateList, setCertificateList] = useState<MyCertificateI[]>([]);
  const [certificateMetadata, setCertificateMetadata] = useState<CertificateMetadataI>();
  const [certificateData, setCertificateData] = useState<CertificateI>();
  const [chosenCertificate, setChosenCertificate] = useState<number>(0);
  const [myCertificateParams, setMyCertificateParams] = useState({
    limit: 10,
    page: 1
  });
  const [isShowCertificate, setIsShowCertificate] = useState<boolean>(false);
  const [triggerCertificate, setTriggerCertificate] = useState<boolean>(false);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchMyCertificates(myCertificateParams)
    }
  }, [
    id,
    userInfo,
    myCertificateParams.page
  ]);

  useEffect(() => {
    if (userInfo !== undefined) {
      setMyCertificateParams(params => ({
        ...params
      }));
    }
  }, [userInfo]);

  useEffect(() => {
    if (triggerCertificate) {
      void fetchCertificateById(certificateList[chosenCertificate]?.ticket_id)
      setIsShowCertificate(true)
    }
  }, [triggerCertificate]);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchMyCertificates = async (
    myCertificateParams: EventListParams
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await getMyCertificate(myCertificateParams);
      setCertificateList(response?.data)
      setCertificateMetadata(response?.metadata)
    } catch (error) {
      toast.error(`Error fetching certificate data: ${error as string}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificateById = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await getCertificateById(id);
      setCertificateData(response)
      setTriggerCertificate(false)
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoading(false);
    }
  };

  const base64ToBlob = (base64: string, type: string = 'application/pdf'): Blob => {
    const binary = atob(base64.replace(/\s/g, ''));
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return new Blob([view], { type });
  };

  return (
    <>
      {isShowCertificate && (
        <ModalShowCertificate
          onClose={() => {
            setIsShowCertificate(prev => !prev);
          }}
          eventName={certificateList[chosenCertificate]?.event_name ?? ''}
          certificateData={certificateData ?? initialCertificate}
          file={URL.createObjectURL(base64ToBlob(certificateData?.pdf_data ?? ''))}
        />
      )}
      <div className="flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
        <div className="flex justify-between w-full relative">
          <div
            onClick={ async() => await router.push('/homepage/event')}
            className='bg-seeds-button-green rounded-lg flex justify-center items-center w-[40px] h-[40px] cursor-pointer absolute left-0 top-[-6px] lg:top-[-4px]'
          >
            <Image
              src={EventIcon}
              alt={'EventIcon'}
              width={20}
              height={20}
            />
          </div>
          <Typography className="w-full text-xl lg:text-2xl font-semibold text-center flex justify-center items-center">
            {
              certificateList?.length > 1
                ? t('seedsEvent.myCertificates')
                : t('seedsEvent.myCertificate')
            }
          </Typography>
        </div>
      </div>

      {/* Certificate List */}
      <div className="flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white mt-4">
        {!loading ? (
          certificateList !== null ? (
            <div className="w-full flex flex-col gap-4">
              {certificateList?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setChosenCertificate(index)
                    setTriggerCertificate(true)
                  }}
                  className='flex justify-between items-center bg-[#F7F7F7] rounded-lg px-4 py-2 cursor-pointer hover:bg-[#e7e7e7] duration-300'
                >
                  <div
                    key={index}
                    className='flex justify-start items-center gap-4'
                  >
                    <div className='flex justify-center items-center w-[45px] h-[45px] bg-seeds-button-green rounded-full'>
                      <Image
                        src={MyCertificateIcon}
                        alt={'MyCertificateIcon'}
                        width={100}
                        height={100}
                        className='w-[30px] h-[30px]'
                      />
                    </div>
                    <div className='font-poppins font-semibold text-[#262626]'>
                      {item?.event_name}
                    </div>
                  </div>
                  <div className='w-[30px] h-[30px] flex justify-center items-center'>
                    <IoIosArrowForward className='text-[#BDBDBD]'/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0 mb-8">
                <Image alt="" src={IconNoData} className="w-[250px]" />
                <p className="font-semibold text-black">
                  {t('seedsEvent.blank1')}
                </p>
                <p className="text-[#7C7C7C]">{t('seedsEvent.blank2')}</p>
              </div>
            </>
          )
        ) : (
          <div className="w-full flex justify-center h-fit my-8">
            <div className="h-[60px]">
              <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Event Pagination */}
      <div className="flex justify-center mx-auto my-8">
        <AssetPagination
          currentPage={myCertificateParams.page}
          totalPages={Math.ceil((certificateMetadata?.total_page ?? 0) / 10)}
          onPageChange={page => {
            setMyCertificateParams({ ...myCertificateParams, page });
          }}
        />
      </div>
    </>
  );
};

export default withAuth(MyCertificate);
