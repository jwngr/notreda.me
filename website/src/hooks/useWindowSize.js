import {useEffect, useState} from 'react';

const _getWindowSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(_getWindowSize);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(_getWindowSize());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}
