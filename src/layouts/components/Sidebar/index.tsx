import NavMenu from '@/layouts/components/NavMenu';
import { configResponsive, useResponsive } from 'ahooks';

configResponsive({
  lg: 1024,
});

const Sidebar = () => {
  // 屏幕尺寸
  const responsive = useResponsive();
  const isLargeScreen = responsive['lg'];

  if (!isLargeScreen) return null;

  return (
    <div className="bg-content1 rounded-r-large h-full w-64 shadow-xs">
      <NavMenu type="sidebar" />
    </div>
  );
};

export default Sidebar;
