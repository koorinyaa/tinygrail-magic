import { createLayoutStore } from '@/stores';
import { Button, Modal, ModalContent } from '@heroui/react';
import { configResponsive, useResponsive } from 'ahooks';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { TbX } from 'react-icons/tb';
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
  const { sidebar, setSidebarOpen } = createLayoutStore();
  const { isOpen } = sidebar;

  useEffect(() => {
    setSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
      <UserProfile />
      <MainMenu />
      <SecondaryMenu />
      <UpdateNotice />
      <VersionInfo />
    </div>
  );

  return (
    <>
      {/* 桌面端侧边栏 */}
      <AnimatePresence>
        {isOpen && isLargeScreen && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ duration: 0.2 }}
            className="bg-content1 rounded-r-large h-full w-64 shadow-xs"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 移动端侧边栏 */}
      <Modal
        isOpen={isOpen && !isLargeScreen}
        size="5xl"
        onOpenChange={setSidebarOpen}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'easeOut',
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: 'easeIn',
              },
            },
          },
        }}
      >
        <ModalContent>{sidebarContent}</ModalContent>
      </Modal>
    </>
  );
};

export default Sidebar;
