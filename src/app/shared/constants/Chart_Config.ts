import { ChartDataset } from 'chart.js';
import { ChartOptions } from 'chart.js';

export const monthlyDatasetTemplate: ChartDataset<'bar'> = {
  label: 'Monthly Expenses',
  data: [],
  backgroundColor: '#42A5F5',
  barPercentage: 0.7,
  categoryPercentage: 0.9,
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
      offset: true,
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

export const CHART_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];