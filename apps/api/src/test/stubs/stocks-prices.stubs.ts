import { StockPrice } from '@prisma/client';

export const stockPriceStub = (): StockPrice => ({
  id: 1,
  company: 'GOOGLE',
  highestPriceOfTheDay: 145.55,
  lowestPriceOfTheDay: 143.5025,
  timestamp: 1641186000000n,
});

export const stocksPricesStub = (): StockPrice[] => [
  stockPriceStub(),
  {
    id: 2,
    company: 'META',
    highestPriceOfTheDay: 84.05,
    lowestPriceOfTheDay: 82.47,
    timestamp: 1672376400000n,
  },

  {
    id: 3,
    company: 'AMAZON',
    highestPriceOfTheDay: 170.7035,
    lowestPriceOfTheDay: 166.1605,
    timestamp: 1641186000000n,
  },
];
