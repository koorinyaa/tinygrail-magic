import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
  const getScreenWidth = () =>
    window.visualViewport?.width ?? window.innerWidth;
  const [screenWidth, setScreenWidth] = useState(getScreenWidth());

  useEffect(() => {
    setScreenWidth(getScreenWidth());
    const handleResize = () => setScreenWidth(getScreenWidth());
    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenWidth < breakpoint;
}
