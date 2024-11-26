import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
interface PieProps {
  data: ChartData<'pie', number[], unknown>;
}

ChartJS.register(ArcElement, Tooltip, Legend);
const PieChart: React.FC<PieProps> = ({ data }) => {
  const options = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        // Sesuaikan tooltip
        callbacks: {
          label: function (context: any) {
            let label = ` Percentage`;
            label += ': ';
            if (context.parsed !== null) {
              label += `${Math.round(context.parsed * 100) / 100}` + '%';
            }

            return label;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 5,
        borderColor: '#fff',
        borderRadius: 10
      }
    }
  };

  return (
    <Pie data={data} options={options} className="rounded-full aspect-auto " />
  );
};

export default PieChart;
