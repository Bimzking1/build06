export const generateRandomColor = (): string => {
  const generate = Math.floor(Math.random() * 16777215).toString(16);

  return '#' + generate;
};
