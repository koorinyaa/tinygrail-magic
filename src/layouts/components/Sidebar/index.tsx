import { createLayoutStore } from '@/stores';
import { cn } from '@/utils/helpers';
import { configResponsive, useResponsive } from 'ahooks';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import MainMenu from './components/MainMenu';
import SecondaryMenu from './components/SecondaryMenu';
import UpdateNotice from './components/UpdateNotice';
import UserProfile from './components/UserProfile';
import VersionInfo from './components/VersionInfo';

configResponsive({
  lg: 1024,
});

const Sidebar = () => {
  // 屏幕尺寸
  const responsive = useResponsive();
  const isLargeScreen = responsive['lg'];
  // 侧边栏状态
  const { sidebar, setSidebarOpen, closeSidebar } = createLayoutStore();
  const { isOpen } = sidebar;

  useEffect(() => {
    setSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);

  return (
    <>
      {/* 侧边栏 */}
      <motion.div
        initial={isLargeScreen ? { x: 0 } : { x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ duration: 0.2 }}
        className={cn('bg-content1 rounded-r-large h-full w-64 shadow-xs', {
          'fixed top-0 left-0 z-40': !isLargeScreen,
        })}
      >
        <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
          <UserProfile />
          <MainMenu />
          <SecondaryMenu />
          <UpdateNotice />
          <VersionInfo />
        </div>
      </motion.div>

      {/* 移动端遮罩层 */}
      {!isLargeScreen && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-overlay fixed inset-0 z-30"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
