import DoughnutChart from '@/components/DoughnutChart';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import CardAssetSlider from './CardAssetSlider';

interface props {
  setPages: any;
  chartData: any;
  changeToAsset: any;
  selectedAsset: any[];
  changeSlider: any;
  sumAsset: number;
  form: any;
  changeForm: any;
  errorMessage: any;
  changeIsLock: any;
  isEdit?: boolean;
  submitEditPie?: any;
}

const PieMain: React.FC<props> = ({
  setPages,
  chartData,
  changeToAsset,
  selectedAsset,
  changeSlider,
  sumAsset,
  form,
  changeForm,
  errorMessage,
  changeIsLock,
  isEdit = false,
  submitEditPie
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div>
        <h1 className="font-bold text-xl text-black">
          {t('social.pieSection.title')}
        </h1>
      </div>
      <button
        className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 text-md"
        onClick={setPages}
      >
        <XMarkIcon className="cursor-pointer" width={30} height={30} />
      </button>

      <div className="flex items-center border-b border-gray-400 py-2 mb-5">
        <input
          type="text"
          className="ml-2 border-none outline-none"
          placeholder={`${t('social.pieSection.placeholder')}`}
          name="pie_title"
          value={form.pie_title}
          onChange={changeForm}
        />
        {errorMessage.title !== '' && (
          <small className="text-[#ff515d] font-bold">
            {errorMessage.title}
          </small>
        )}
      </div>

      <div className="w-[180px] h-[180px] mx-auto my-auto">
        <DoughnutChart
          data={chartData}
          centerText={'+' + sumAsset.toString() + '%'}
        />
      </div>
      <div>
        <h1 className="font-semibold text-md text-black">
          {t('social.pieSection.amount')}
        </h1>
      </div>
      <div className="flex items-center border-b border-gray-400 py-2">
        <h1 className="font-bold text-sm items-start text-black">IDR</h1>
        <input
          type="text"
          className="ml-2 border-none outline-none text-black text-xl font-bold placeholder:text-base placeholder:font-medium"
          name="pie_amount"
          placeholder={`${t('social.pieSection.amountError')}`}
          value={form.pie_amount}
          onChange={changeForm}
        />
        {errorMessage.amount !== '' && (
          <small className="text-[#ff515d] font-bold">
            {errorMessage.amount}
          </small>
        )}
      </div>

      <div className="flex items-center py-2 justify-between">
        <h1 className="font-bold text-black">Assets</h1>
        <button
          onClick={changeToAsset}
          className="flex justify-center p-2 text-sm items-center rounded-full text-white font-semibold font-poppins h-fit bg-seeds-button-green"
        >
          Add Assets +
        </button>
      </div>

      {errorMessage.moreThan100 !== '' && (
        <small className="text-[#ff515d] font-bold">
          {errorMessage.moreThan100}
        </small>
      )}

      <div>
        {selectedAsset.length !== 0
          ? selectedAsset.map((data, idx) => (
              <CardAssetSlider
                data={data}
                key={idx}
                changeSlider={changeSlider}
                index={idx}
                changeIsLock={changeIsLock}
                sumAsset={sumAsset}
              />
            ))
          : null}
      </div>

      <div className="flex items-center justify-center">
        <Button
          className="text-white font-semibold font-poppins bg-seeds-button-green p-2 rounded-full mt-2 w-1/2"
          onClick={!isEdit ? setPages : submitEditPie}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default PieMain;
