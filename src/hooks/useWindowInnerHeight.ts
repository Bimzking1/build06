import { useEffect, useState } from 'react';

const useWindowInnerHeight = (): number | undefined => {
  const [height, setHeight] = useState<number | undefined>();

  useEffect(() => {
    if (height === undefined) {
      setHeight(window.innerHeight);
    }

    const handleResize = (): void => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [height]);

  return height;
};

export default useWindowInnerHeight;
