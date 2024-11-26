const isSSR = typeof window === 'undefined';

export const reloadPage = (): void => {
  try {
    if (typeof window !== 'undefined' && isSSR) {
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};
