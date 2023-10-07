import { BestGain } from "@shared";

export const bestGainStub = (): BestGain => ({
  buyDay: {
    id: 601,
    timestamp: 1653364800000n,
    highestPriceOfTheDay: 105.4,
    lowestPriceOfTheDay: 101.26,
    company: 'AMAZON',
  },
  sellDay: {
    id: 658,
    timestamp: 1660622400000n,
    highestPriceOfTheDay: 146.57,
    lowestPriceOfTheDay: 142,
    company: 'AMAZON',
  },
});
