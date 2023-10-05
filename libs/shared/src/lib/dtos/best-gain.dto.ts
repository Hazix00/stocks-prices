import { StockPrice } from "@prisma/client";

export interface BestGain {
  buyDay: StockPrice;
  sellDay: StockPrice;
}
