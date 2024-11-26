import PieAssets from '@/components/circle/pie/PieAssets';
import PieMain from '@/components/circle/pie/PieMain';
import { formatCurrency, stringToNumberCurrency } from '@/helpers/currency';
import { generateRandomColor } from '@/helpers/generateRandomColor';
import { updatePost } from '@/repository/circleDetail.repository';
import { Dialog } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

interface props {
  isOpen: any;
  handleOpen: any;
  chartData: any;
  form: any;
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

interface FormPie {
  pie_title: string;
  pie_amount: any;
  pie: any[];
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

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

const initialChartData = {
  labels: ['dummy'],
  datasets: [
    {
      data: [100],
      backgroundColor: ['#9F9F9F']
    }
  ]
};

const CopyPie: React.FC<props> = ({ handleOpen, isOpen, form }) => {
  const [selectedAsset, setSelectedAsset] = useState<AssetInterface[]>([]);
  const [isAsset, setIsAsset] = useState<boolean>(false);
  const [sumAsset, setSumAsset] = useState(0);
  const [formPie, setFormPie] = useState<FormPie>();
  const [errorMessage, setErrorMessage] =
    useState<errorMessage>(initialErrorMessage);
  const [chartData, setChartData] = useState<ChartData>(initialChartData);

  const handleChangeFormPie = (e: any): void => {
    const target = e.target;
    const name = target.name;
    let value = target.value;

    if (name === 'pie_amount') {
      value = formatCurrency(value);
    }

    setFormPie((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChangeErrorMessage = (name: string, value: string): void => {
    setErrorMessage(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRemoveSelectedAsset = (index: number): void => {
    const newData = [...selectedAsset];
    newData.splice(index, 1);

    setSelectedAsset(newData);
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

  const handleAssetIsLock = (e: any, index: number): void => {
    setSelectedAsset((prevState: AssetInterface[]) => {
      const updatedData = [...prevState];
      updatedData[index].isLock = !updatedData[index].isLock;

      return updatedData;
    });
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

  const submitCopyPie = (): void => {
    const payload: any = {
      content_text: form.content_text,
      media_urls: form.media_urls,
      privacy: form.privacy,
      is_pinned: form.is_pinned
    };

    const newDataPie = selectedAsset?.map(item => ({
      asset_id: item?.id,
      price: item?.price,
      allocation: item?.value
    }));

    payload.pie = newDataPie;
    payload.pie_title = formPie?.pie_title;
    payload.pie_amount = stringToNumberCurrency(formPie?.pie_amount);

    updatePost(payload, form.id)
      .then((resData: any) => {
        window.location.reload();
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const handleAssets = (): void => {
    setIsAsset(!isAsset);
  };

  useEffect(() => {
    setFormPie({
      pie_title: form.pie_title,
      pie_amount: formatCurrency(form.pie_amount.toString()),
      pie: form.pie
    });

    const assetData = form?.pie?.map((item: any) => ({
      id: item?.id,
      realTicker: item?.real_ticker,
      exchange_currency: item?.exchange_currency,
      logo: item?.logo,
      name: item?.name,
      price: item?.price_bar?.open,
      exchangeRate: item?.exchange_rate,
      value: item?.allocation,
      isLock: false
    }));

    setSelectedAsset(assetData);

    const convertedData: ChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    };

    form.pie.forEach((item: any) => {
      convertedData.labels.push(item.name);
      convertedData.datasets[0].data.push(item.allocation);
      convertedData.datasets[0].backgroundColor.push(generateRandomColor());
    });

    setChartData(convertedData);
  }, []);

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
            changeForm={handleChangeFormPie}
            form={formPie}
            errorMessage={errorMessage}
            changeIsLock={handleAssetIsLock}
            isEdit={true}
            submitEditPie={submitCopyPie}
          />
        )}
      </div>
    </Dialog>
  );
};

export default CopyPie;
