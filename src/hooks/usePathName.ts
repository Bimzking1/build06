import { useEffect, useState } from 'react';

const usePathName = (): string | undefined => {
  const [path, setPath] = useState<string | undefined>();

  useEffect(() => {
    if (path === undefined) {
      setPath(window.location.pathname);
    }
  }, [path]);

  return path;
};

export default usePathName;
