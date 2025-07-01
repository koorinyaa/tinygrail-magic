import { createLayoutStore } from '@/stores';
import { cn } from '@/utils/helpers';
import { Listbox, ListboxItem, ListboxSection } from '@heroui/react';
import { configResponsive, useResponsive } from 'ahooks';
import {
  TbCards,
  TbChartBar,
  TbFlame,
  TbFlare,
  TbGhost3
} from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';

configResponsive({
  lg: 1024,
});

interface MainMenuProps {
  type: 'sidebar' | 'bottombar';
}

function MainMenu({ type = 'sidebar' }: MainMenuProps) {
  // 屏幕尺寸
  const responsive = useResponsive();
  const isLargeScreen = responsive['lg'];
  const { closeSidebar } = createLayoutStore();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = {
    Pages: [
      {
        key: 'topWeek',
        icon: TbFlame,
        label: '萌王',
        path: '/topWeek',
      },
      {
        key: 'starTower',
        icon: TbFlare,
        label: '通天塔',
        path: '/starTower',
      },
      {
        key: 'character',
        icon: TbGhost3,
        label: '角色',
        path: '/character',
      },
      {
        key: 'ranking',
        icon: TbChartBar,
        label: '排行榜',
        path: '/ranking',
      },
    ],
    Account: [
      {
        key: 'myTinygrail',
        icon: TbCards,
        label: '我的小圣杯',
        path: '/myTinygrail',
      },
    ],
  };

  return (
    <div className="w-full flex-1 py-2">
      <Listbox aria-label="main menu" color="secondary" variant="light">
        {Object.entries(menuItems).map(([sectionTitle, items]) => {
          if (type === 'bottombar' && sectionTitle === 'Pages') return null;
          return (
            <ListboxSection title={sectionTitle} key={sectionTitle}>
              {items.map((item) => (
                <ListboxItem
                  key={item.key}
                  onPress={() => {
                    navigate(item.path);
                    if (!isLargeScreen) {
                      closeSidebar();
                    }
                  }}
                  startContent={<item.icon className="size-5 opacity-60" />}
                  classNames={{
                    base: cn({
                      'text-secondary bg-secondary/20': currentPath === item.path,
                    }),
                    title: 'font-medium',
                  }}
                  aria-selected={currentPath === item.path}
                >
                  {item.label}
                </ListboxItem>
              ))}
            </ListboxSection>
          );
        })}
      </Listbox>
    </div>
  );
}

export default MainMenu;
