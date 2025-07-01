import { cn } from '@/utils/helpers';
import { useEffect, useRef, useState } from 'react';
import { FaChartSimple } from 'react-icons/fa6';
import { TbFlameFilled, TbFlareFilled, TbGhost3Filled } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';

function BarMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeIndex, setActiveIndex] = useState(0); // 当前激活的菜单项索引
  const menuRefs = useRef<Array<HTMLButtonElement | null>>([]); // 菜单项引用
  const [isFirstRender, setIsFirstRender] = useState(true); // 是否首次渲染

  const menuItems = [
    {
      key: 'topWeek',
      icon: TbFlameFilled,
      label: '萌王',
      path: '/topWeek',
    },
    {
      key: 'starTower',
      icon: TbFlareFilled,
      label: '通天塔',
      path: '/starTower',
    },
    {
      key: 'character',
      icon: TbGhost3Filled,
      label: '角色',
      path: '/character',
    },
    {
      key: 'ranking',
      icon: FaChartSimple,
      label: '排行榜',
      path: '/ranking',
    },
  ];

  // 根据当前路径设置激活的菜单项索引
  useEffect(() => {
    const index = menuItems.findIndex((item) => item.path === currentPath);
    setActiveIndex(index);

    // 首次渲染后，设置为非首次渲染状态
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [currentPath, isFirstRender]);

  return (
    <div className="bg-content1/20 border-content1/30 rounded-full border shadow-lg backdrop-blur-xs">
      <div className="relative flex w-full justify-around px-1.5">
        {/* 背景动画元素 */}
        <div
          className={cn(
            'pointer-events-none absolute top-0 h-full',
            !isFirstRender && activeIndex >= 0 && 'transition-all duration-200 ease-in-out',
          )}
          style={{
            left: menuRefs.current[activeIndex]?.offsetLeft || 0,
            width: menuRefs.current[activeIndex]?.offsetWidth || 0,
          }}
        >
          <div className="bg-content1/80 mt-0.5 h-[calc(100%-0.25rem)] rounded-full" />
        </div>

        {menuItems.map((item, index) => (
          <button
            key={item.key}
            ref={(el) => (menuRefs.current[index] = el)}
            onClick={() => navigate(item.path)}
            className={cn(
              'text-foreground/80 relative -mx-1 my-0.5 flex w-14 cursor-pointer flex-col items-center justify-center px-2 pt-1 pb-0.5',
              {
                'text-secondary': currentPath === item.path,
              },
            )}
          >
            <item.icon className="size-5" />
            <span className="max-w-full scale-80 overflow-hidden text-xs text-ellipsis whitespace-nowrap">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BarMenu;
