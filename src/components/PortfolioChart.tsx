import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

interface DoughnutProps {
  data: ChartData<'doughnut', number[], unknown>;
  centerText: string;
}

ChartJS.register(ArcElement, Tooltip, Legend);
const PortfolioChart: React.FC<DoughnutProps> = ({ data, centerText }) => {
  const options = {
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderWidth: 5,
        borderRadius: 10
      }
    }
  };

  const textCenter = {
    id: 'textCenter',
    beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
      const { ctx } = chart;
      ctx.save();
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#424242';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        centerText,
        chart?.getDatasetMeta(0)?.data[0]?.x ?? 0,
        chart?.getDatasetMeta(0)?.data[0]?.y ?? 0
      );
    }
  };

  return (
    <Doughnut
      data={data}
      options={options}
      plugins={[textCenter]}
      className="rounded-full aspect-auto "
    />
  );
};

export default PortfolioChart;
