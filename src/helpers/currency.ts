export const formatCurrency = (value: string): string => {
  const cleanValue = value.replace(/[.,]/g, '');

  const formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return formattedValue;
};

export const stringToNumberCurrency = (value: string): number => {
  const stringWithoutDots = value.replace(/\./g, '');

  const numberValue = parseInt(stringWithoutDots, 10);
  return numberValue;
};

export const standartCurrency = (value: any): string => {
  const hasCents = value % 1 !== 0;
  return ` ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0
  }).format(value)}`;
};

export const calculatePercentageDifference = (
  open: number,
  close: number
): any => {
  const difference = close - open;
  const percentageDifference = (difference / open) * 100;
  let result: any = {
    value: '',
    isUpTrend: false,
    isDownTrend: false,
    remain: undefined
  };

  if (percentageDifference > 0) {
    result = {
      value: percentageDifference.toFixed(2),
      isUpTrend: true,
      isDownTrend: false
    };
  } else if (percentageDifference < 0) {
    result = {
      value: Math.abs(percentageDifference).toFixed(2),
      isUpTrend: false,
      isDownTrend: true
    };
  } else {
    result = {
      value: '0',
      remain: true
    };
  }
  return result;
};

export const formatNumber = (
  number: number,
  isIndonesian: boolean = false
): string => {
  const indoUnits: string[] = ['', 'rb', 'jt', 'm', 't'];
  const intlUnits: string[] = ['', 'K', 'M', 'B', 'T'];

  const units = isIndonesian ? indoUnits : intlUnits;
  const unitIndex = Math.floor(Math.log10(number) / 3);

  if (unitIndex >= units.length) {
    return number.toFixed(2).replace(/\.00$/, ''); // Remove decimal places if they are ".00"
  }

  const scaledNumber = number / Math.pow(1000, unitIndex);
  const suffix = units[unitIndex];
  const formattedNumber = `${scaledNumber.toFixed(2)}${suffix}`;

  return formattedNumber.replace(/\.00$/, ''); // Remove decimal places if they are ".00"
};

export const formatAssetPrice = (price: number): string => {
  let roundedPrice: number;
  
  if (price > 11 || price < -11) {
    roundedPrice = Math.round(price * 100) / 100;
  } else if ((price < 11 && price > 1) || (price > -11 && price < -1)) {
    roundedPrice = Math.round(price * 1000) / 1000;
  } else if ((price > 0.1 && price < 1) || (price < -0.1 && price > -1)) {
    roundedPrice = Math.round(price * 10000) / 10000;
  } else if ((price > 0 && price < 0.1) || (price > -0.1 && price < 0)) {
    roundedPrice = Math.round(price * 1000000) / 1000000;
  } else {
    roundedPrice = price ?? 0;
  }

  const hasCents = roundedPrice % 1 !== 0;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0
  }).format(roundedPrice);
};