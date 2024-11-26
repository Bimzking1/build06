import PieAssets from '@/components/circle/pie/PieAssets';
import PieMain from '@/components/circle/pie/PieMain';
import { generateRandomColor } from '@/helpers/generateRandomColor';
import { Dialog } from '@material-tailwind/react';
import { useState } from 'react';

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

interface AssetInterface {
  id: string;
  quote: string;
  currency: string;
  image: string;
  name: string;
  price: number;
  regularPercentage: number;
  value: number;
  isLock: boolean;
}

interface props {
  changeForm: any;
  form: any;
  setPages: any;
  selectedAsset: AssetInterface[];
  setSelectedAsset: any;
  chartData: ChartData;
  setChartData: any;
}

interface errorMessage {
  title: string;
  amount: string;
  moreThan100: string;
  moreThan8: string;
}

const initialErrorMessage = {
  title: '',
  amount: '',
  moreThan100: '',
  moreThan8: ''
};

const ModalPie: React.FC<props> = ({
  setPages,
  changeForm,
  form,
  selectedAsset,
  setSelectedAsset,
  chartData,
  setChartData
}) => {
  const [isAsset, setIsAsset] = useState<boolean>(false);
  const [sumAsset, setSumAsset] = useState(0);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] =
    useState<errorMessage>(initialErrorMessage);

  const handleOpen = (): void => {
    setPages('text');
    setIsOpen(!isOpen);
  };

  const handleAssets = (): void => {
    if (form.pie_title === '') {
      handleChangeErrorMessage('title', 'Title is required');
    } else {
      handleChangeErrorMessage('title', '');
    }

    if (form.pie_amount === 0) {
      handleChangeErrorMessage('amount', 'Amount is required');
    } else {
      handleChangeErrorMessage('amount', '');
    }

    if (form.pie_title !== '' && form.pie_amount !== 0) {
      setIsAsset(!isAsset);
    }
  };

  const handleChangeErrorMessage = (name: string, value: string): void => {
    setErrorMessage(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChartData = (value: any): void => {
    const color = generateRandomColor();

    const foundDummy = chartData.labels.includes('dummy');
    if (foundDummy) {
      setChartData({
        labels: [value.quote],
        datasets: [
          {
            data: [0],
            backgroundColor: [color]
          }
        ]
      });
    } else {
      setChartData((prevState: ChartData) => ({
        ...prevState,
        labels: [...chartData.labels, value.quote],
        datasets: [
          {
            ...chartData.datasets[0],
            data: [...chartData.datasets[0].data, 0],
            backgroundColor: [...chartData.datasets[0].backgroundColor, color]
          }
        ]
      }));
    }
  };

  const handleSelectedAsset = (e: any): void => {
    const target = e.target;
    const value = JSON.parse(target.value);

    value.isLock = false;
    value.value = 0;

    if (selectedAsset.length >= 8) {
      console.error('Jumlah data maksimal telah tercapai (8)');
      return;
    }

    const isDataExist = selectedAsset.some(item => item.id === value.id);

    if (isDataExist) {
      const newData = selectedAsset.filter(item => item.id !== value.id);
      setSelectedAsset(newData);
    } else {
      handleChartData(value);
      setSelectedAsset((oldMessages: AssetInterface[]) => [
        ...oldMessages,
        value
      ]);
    }
  };

  const handleRemoveSelectedAsset = (index: number): void => {
    const newData = [...selectedAsset];
    newData.splice(index, 1);

    setSelectedAsset(newData);
  };

  const handleSliderAsset = (e: any, index: number): void => {
    const target = e.target;
    const newValue = Math.round(target.value);

    setChartData((prevState: ChartData) => {
      const updatedData = [...prevState.datasets[0].data];
      updatedData[index] = newValue;
      const total = updatedData.reduce((acc, value) => acc + value, 0);

      setSumAsset(total);
      if (total <= 100) {
        handleChangeErrorMessage('moreThan100', '');
        setSelectedAsset((prevState: AssetInterface[]) => {
          const updatedData = [...prevState];
          updatedData[index].value = newValue;

          return updatedData;
        });
        return {
          ...prevState,
          datasets: [
            {
              ...prevState.datasets[0],
              data: updatedData
            }
          ]
        };
      } else {
        handleChangeErrorMessage(
          'moreThan100',
          'You cannot set value more than 100'
        );
        console.error('Jumlah total data tidak boleh melebihi 100');
        return prevState;
      }
    });
  };

  const handleAssetIsLock = (e: any, index: number): void => {
    setSelectedAsset((prevState: AssetInterface[]) => {
      const updatedData = [...prevState];
      updatedData[index].isLock = !updatedData[index].isLock;

      return updatedData;
    });
  };

  return (
    <Dialog
      open={isOpen}
      handler={handleOpen}
      className="max-w-full w-[90%] md:w-[50%] lg:w-[40%]"
    >
      <div className="bg-white rounded-lg p-14 shadow-md relative overflow-y-auto max-h-screen">
        {isAsset ? (
          <PieAssets
            setPages={handleOpen}
            changeToAsset={handleAssets}
            selectedAsset={selectedAsset}
            handleSelectedAsset={handleSelectedAsset}
            removeSelectedAsset={handleRemoveSelectedAsset}
          />
        ) : (
          <PieMain
            setPages={handleOpen}
            chartData={chartData}
            changeToAsset={handleAssets}
            selectedAsset={selectedAsset}
            changeSlider={handleSliderAsset}
            sumAsset={sumAsset}
            changeForm={changeForm}
            form={form}
            errorMessage={errorMessage}
            changeIsLock={handleAssetIsLock}
          />
        )}
      </div>
    </Dialog>
  );
};

export default ModalPie;
