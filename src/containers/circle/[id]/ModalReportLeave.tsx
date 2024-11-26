import FinalModalCircle from '@/components/circle/FinalModalCircle';
import { errorCircle, successCircleSetting } from '@/constants/assets/icons';
import { reportCircle, reportOptions } from '@/repository/report.repository';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface props {
  open: any;
  handleOpen: any;
  circleId: string;
}

const ModalReportCircle: React.FC<props> = ({ open, handleOpen, circleId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseApi, setResponseApi] = useState('');
  const { t } = useTranslation();
  const [options, setOptions] = useState<any[]>();
  const [formRequest, setFormRequest] = useState({
    target_circle_id: circleId,
    type_report: '',
    question_report_id: ''
  });

  const handleRadioChange = (event: any): void => {
    const value = JSON.parse(event.target.value);

    setFormRequest(prevState => {
      return {
        ...prevState,
        type_report: value.title,
        question_report_id: value.id
      };
    });
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setIsLoading(true);
      reportCircle(formRequest)
        .then(res => {
          setResponseApi('success');
          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
          setResponseApi('failed');
          console.log(err);
        });
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  const fetchReportOptions = async (): Promise<void> => {
    try {
      setIsLoading(true);
      reportOptions()
        .then(res => {
          setOptions(res);
          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  useEffect(() => {
    fetchReportOptions()
      .then()
      .catch(() => {});
  }, []);

  return (
    <>
      {responseApi === 'success' ? (
        <FinalModalCircle
          button="Done"
          title="Laporan telah diserahkan"
          subtitle="Terima kasih telah membantu kami"
          imageUrl={successCircleSetting.src}
          handleOpen={handleSubmit}
          error={false}
        />
      ) : responseApi === 'failed' ? (
        <FinalModalCircle
          button="Try Again"
          title="Failed to report the circle"
          subtitle="Report failed to send, try again later"
          imageUrl={errorCircle.src}
          handleOpen={handleSubmit}
          error={true}
        />
      ) : null}
      <Dialog
        open={open}
        handler={handleOpen}
        className="max-w-full w-[90%] md:w-[50%] lg:w-[40%]"
      >
        <DialogHeader className="flex justify-between items-center p-2">
          <p></p>
          <XMarkIcon
            className="cursor-pointer"
            onClick={handleOpen}
            width={30}
            height={30}
          />
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col mb-5">
            <Typography className="text-base font-semibold text-center text-black">
              {t('circleSetting.reportCirlce.title')}
            </Typography>
            <Typography className="text-sm font-normal text-center text-[#7C7C7C]">
              {t('circleSetting.reportCirlce.subtitle1')}
            </Typography>
          </div>
          <Typography className="text-sm font-semibold text-black text-left">
            {t('circleSetting.reportCirlce.subtitle2')}
          </Typography>

          <div className="flex flex-col mt-5 gap-3">
            {options?.map((data, idx) => (
              <div className="flex justify-between" key={idx}>
                <Typography className="text-sm font-normal text-black">
                  {data.title}
                </Typography>
                <input
                  type="radio"
                  value={JSON.stringify(data)}
                  onChange={handleRadioChange}
                  id="radioButton01"
                  name="radioGroup"
                  className="appearance-none w-6 h-6 rounded-full border border-gray-500 checked:bg-seeds-green checked:border-white focus:outline-none ring-2 ring-seeds-green"
                />
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter className="justify-center">
          <Button
            onClick={handleSubmit}
            className="rounded-full text-sm font-semibold bg-[#3AC4A0] px-20"
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ModalReportCircle;
