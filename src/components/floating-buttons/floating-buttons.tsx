import { ToTopButton } from '@/components/to-top-button';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * 悬浮按钮组
 */
export function FloatingButtons() {
  const { pageContainerRef } = useStore();
  // 返回顶部按钮是否显示
  const [showToTop, setShowToTop] = useState(false);

  useEffect(() => {
    const container = pageContainerRef?.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop } = container;

      // 控制返回顶部按钮的显示
      setShowToTop(scrollTop > 200);
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [pageContainerRef]);

  return (
    <div className="fixed bottom-10 right-4 md:right-10 flex flex-col z-50">
      {showToTop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ToTopButton />
        </motion.div>
      )}
    </div>
  );
}
