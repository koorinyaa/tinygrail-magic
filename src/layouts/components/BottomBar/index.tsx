import { configResponsive, useResponsive } from 'ahooks';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import AvatarModal from './components/AvatarModal';
import BarAvatar from './components/BarAvatar';
import BarMenu from './components/BarMenu';

configResponsive({
  lg: 1024,
});

const BottomBar = () => {
  // 屏幕尺寸
  const responsive = useResponsive();
  const isLargeScreen = responsive['lg'];

  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false); // 头像弹窗状态

  // 只在移动端显示底栏
  if (isLargeScreen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform select-none"
      >
        <div className="flex h-12 flex-row gap-2">
          <BarMenu />
          <BarAvatar
            onPress={() => {
              setAvatarModalOpen(true);
            }}
          />
          <AvatarModal isOpen={isAvatarModalOpen} setOpen={setAvatarModalOpen} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BottomBar;
