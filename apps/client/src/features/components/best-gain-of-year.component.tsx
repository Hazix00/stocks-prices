import React, { useEffect, useState } from 'react';
import { StocksService } from '../stocks-prices/stocks-prices.service';
import { BestGain } from '@shared';

interface PropsType {
  company: string;
  userName: string;
  capital: number;
  year: number;
}

const BestGainOfYearComponent: React.FC<PropsType> = ({
  company,
  userName,
  capital,
  year,
}) => {
  const stocksService = StocksService.getInstance();

  const [bestGain, setBestGain] = useState<BestGain | null>(null);

  useEffect(() => {
    // Fetch the best buy and sell days from the backend service
    stocksService
      .getBestGain(company, year)
      .then(({ data }) => {
        setBestGain(data);
      })
      .catch((error: Error) => {
        console.error('Error fetching best gain:', error);
      });
  }, [company, year]);

  const calculateGain = () => {
    if (bestGain) {
      // Calculate the number of shares you can buy with the capital
      const buyPrice = bestGain.buyDay.lowestPriceOfTheDay;
      const numberOfShares = capital / buyPrice;

      // Calculate the gain
      const sellPrice = bestGain.sellDay.highestPriceOfTheDay;
      const gain = (sellPrice - buyPrice) * numberOfShares;

      return gain;
    }

    return 0; // Return 0 if there's no best gain data yet
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleString(new Intl.Locale('fr'), {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      {bestGain ? (
        <div>
          <p>
            {userName} devrait acheter {capital}€ d'actions {company} sur le{' '}
            {formatDate(bestGain.buyDay.timestamp)} au prix de{' '}
            {bestGain.buyDay.lowestPriceOfTheDay.toFixed(2)}€.
          </p>
          <p>
            Il devrait ensuite vendre ces actions le{' '}
            {formatDate(bestGain.sellDay.timestamp)} au prix de{' '}
            {bestGain.sellDay.highestPriceOfTheDay.toFixed(2)}€ pour faire un gain de{' '}
            {calculateGain().toFixed(2)}€.
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BestGainOfYearComponent;
