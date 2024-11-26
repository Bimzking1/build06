export const formatAlphabeticHandler = (value: string): string => {
  return value.replace(/[^A-Za-z]/g, '');
};

export const formatAlphabeticWithSpaceHandler = (value: string): string => {
  return value.replace(/[^A-Za-z ]/g, '');
};

export const formatNumericHandler = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const formatSeedsTagHandler = (value: string): string => {
  return value.replace(/[@0-9 ]/g, '');
};
