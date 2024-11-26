export const calculatePercentageChange = (
  open: number,
  close: number
): number | string => {
  if (open !== 0) {
    const percentageChange = ((close - open) / open) * 100;
    return parseFloat(percentageChange.toFixed(2));
  } else {
    return 0;
  }
};
