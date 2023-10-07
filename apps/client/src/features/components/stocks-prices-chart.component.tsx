import React, { useEffect, useState } from 'react';
import { StocksService } from '../stocks-prices/stocks-prices.service';
import { StocksPricesPerMonthDto } from '@shared';
import { Line } from 'react-chartjs-2';
import { ChartData } from 'chart.js';
import { getMonthName } from '../../utils/get-month-name';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StocksPricesChartComponent: React.FC = () => {
  const stocksService = StocksService.getInstance();

  const [stocksData, setStocksData] = useState<{
    google: StocksPricesPerMonthDto[];
    amazon: StocksPricesPerMonthDto[];
  }>({ google: [], amazon: [] });

  useEffect(() => {
    console.log('Fetching data...');

    // Fetching data for GOOGLE and AMAZON for the year 2022

    Promise.all(
      ['GOOGLE', 'AMAZON'].map((company) =>
        stocksService.getStocksByCompanyAndYear(company, 2022)
      )
    )
      .then(([googleRes, amazonRes]) => {
        setStocksData({
          google: googleRes.data,
          amazon: amazonRes.data,
        });
      })
      .catch((error: Error) => console.error('Error fetching data:', error));
  }, []);

  // Preparing data for the chart
  const chartData: ChartData<'line'> = {
    labels: stocksData.google.map((entry) => getMonthName(entry.month)),
    datasets: [
      {
        label: 'Google',
        data: stocksData.google.map((entry) => entry.avgprice),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Amazon',
        data: stocksData.amazon.map((entry) => entry.avgprice),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Define chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 200,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  console.log('chartData', chartData);

  return (
    <div>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default StocksPricesChartComponent;
