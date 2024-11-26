import { useEffect, useState } from 'react';

const useWindowInnerWidth = (): number | undefined => {
  const [width, setWidth] = useState<number | undefined>();

  useEffect(() => {
    if (width === undefined) {
      setWidth(window.innerWidth);
    }

    const handleResize = (): void => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width]);

  return width;
};

export default useWindowInnerWidth;
