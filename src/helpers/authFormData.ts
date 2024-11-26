import countries from '@/constants/countries.json';

export const handleFormattedData = <T extends Record<string, any>>(
  formData: T,
  country: number
): T => {
  const formattedData = {
    ...formData,
    phoneNumber: `${countries[country]?.dialCode.replace('+', '')}${
      formData?.phoneNumber as string
    }`
  };
  return formattedData;
};

export const handleChangePhoneNumber = <T extends Record<string, any>>(
  e: React.ChangeEvent<HTMLInputElement>,
  dialCode: string,
  formData: T,
  setFormData: React.Dispatch<React.SetStateAction<T>>
): void => {
  if (/^\d*$/.test(e.target.value)) {
    if (formData.phoneNumber === dialCode) {
      setFormData({
        ...formData,
        phoneNumber: e.target.value.substring(dialCode.length)
      });
    } else if (formData.phoneNumber === '0') {
      setFormData({
        ...formData,
        phoneNumber: e.target.value.substring(1)
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  }
};
