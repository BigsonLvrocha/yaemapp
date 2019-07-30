import { subDays, isAfter } from 'date-fns';

export function getItemPeriodDetail(history, period) {
  const threshold = subDays(Date.now(), period);
  const validDates = history.filter(item => isAfter(new Date(item.date), threshold));
  const averagePrice = validDates.reduce((prev, curr) => (prev + curr.average), 0) / period;
  const averagePriceVariation = validDates.reduce((prev, curr) => (
    prev + (curr.highest - curr.lowest)
  ), 0);
  const averageVolume = validDates.reduce((prev, curr) => (prev + curr.volume), 0) / period;
  const stdDevVolume = Math.sqrt(validDates.reduce((prev, curr) => (
    prev + (curr.volume - averageVolume) * (curr.volume - averageVolume)
  ), 0) / (period - 1));
  const iskVolume = validDates.map(item => item.volume * item.average);
  const averageIskVolume = iskVolume.reduce((prev, curr) => (prev + curr), 0) / period;
  const stdDevIskVolume = Math.sqrt(iskVolume.reduce((prev, curr) => (
    prev + (curr - averageIskVolume) * (curr - averageIskVolume)
  ), 0) / (period - 1));
  return {
    averagePrice,
    averagePriceVariation,
    averageVolume,
    stdDevVolume,
    averageIskVolume,
    stdDevIskVolume,
  };
}

export function getItemHistoryDetail(history) {
  return {
    hist30: getItemPeriodDetail(history, 30),
    hist15: getItemPeriodDetail(history, 15),
    hist7: getItemPeriodDetail(history, 7),
  };
}
