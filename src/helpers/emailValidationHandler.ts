export const emailValidationHandler = (value: string): boolean => {
  const expression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return expression.test(value);
};
