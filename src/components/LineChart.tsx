import { formatNumber } from '@/helpers/currency';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

interface LineChartProps {
  data: any;
}

ChartJS.register(...registerables);

const getGradient = (ctx: any, chartArea: any): any => {
  const gradient = ctx.createLinearGradient(
    0,
    chartArea.bottom,
    0,
    chartArea.top
  );
  gradient.addColorStop(0.9, '#3AC4A0');
  gradient.addColorStop(0, '#FFFFFF');
  return gradient;
};

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const labelDummy = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const dataDummy = [0, 0, 0, 0, 0, 0];

  const dataChart = {
    labels: data?.x ?? labelDummy,
    datasets: [
      {
        label: 'Price Bar',
        data: data?.y ?? dataDummy,
        fill: true,
        borderColor: '#3AC4A0',
        backgroundColor: function (context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (chartArea == null) return;
          return getGradient(ctx, chartArea);
        }
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
    color: '#424242',
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Arial',
            size: 12
          },
          color: '#7C7C7C',
          backgroundColor: '#7C7C7C',
          backdropPadding: 30,
          padding: 20,
          backdropColor: '#7C7C7C'
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          callback: (label: any) =>
            label === 0 || label < 1 ? label : formatNumber(label)
        }
      }
    }
  };

  return <Line data={dataChart} options={options} />;
};

export default LineChart;
