import { ChartDataset } from 'chart.js';
import { ChartOptions } from 'chart.js';

export const monthlyDatasetTemplate: ChartDataset<'bar'> = {
  label: 'Monthly Expenses',
  data: [], 
  backgroundColor: '#42A5F5',
  maxBarThickness: 60,
  barPercentage: 1,
  categoryPercentage: 1,
  borderSkipped: false
};

export const defaultChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 26,
        font: {
          size: 14
        }
      }
    }
  },
  scales: {
    x: {
      type: 'category',
      grid: {
        display: false
      },
      offset: false,
      ticks: {
        align: 'center'
      }
    },
    y: {
      grid: {
        display: false
      }
    }
  }
};