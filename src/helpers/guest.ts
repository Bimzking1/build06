export const isGuest = (): boolean => {
  const guest =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('isGuest') ?? false
      : false;

  if (guest === 'true') {
    return true;
  } else {
    return false;
  }
};
