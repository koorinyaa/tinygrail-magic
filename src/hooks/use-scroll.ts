import { useEffect, useState } from 'react';

export const useScroll = (scrollContainerRef: React.RefObject<HTMLElement>) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    let lastScrollTop = element.scrollTop;

    const handleScroll = () => {
      const currentScrollTop = element.scrollTop;

      setScrollPosition(currentScrollTop);
      setScrollDirection(currentScrollTop > lastScrollTop ? 'down' : 'up');
      lastScrollTop = currentScrollTop;
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef]);

  return { scrollPosition, scrollDirection };
};
