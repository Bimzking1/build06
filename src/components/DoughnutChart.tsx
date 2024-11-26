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
const DoughnutChart: React.FC<DoughnutProps> = ({ data, centerText }) => {
  const options = {
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '50%',
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
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#69FFC9';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        centerText,
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y
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

export default DoughnutChart;
