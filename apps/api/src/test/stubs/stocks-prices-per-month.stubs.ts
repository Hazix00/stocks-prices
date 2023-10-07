import { StocksPricesPerMonthDto } from "@shared";

export const stocksPricesPerMonthStub = (): StocksPricesPerMonthDto[] => [
  {
    company: 'GOOGLE',
    year: 2022,
    month: 1,
    avgprice: 145.55,
  },
  {
    company: 'META',
    year: 2022,
    month: 1,
    avgprice: 84.05,
  },
  {
    company: 'AMAZON',
    year: 2022,
    month: 1,
    avgprice: 170.7035,
  },
];
