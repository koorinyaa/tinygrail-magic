import { createLayoutStore } from '@/stores';
import { cn } from '@/utils/helpers';
import { Listbox, ListboxItem, ListboxSection } from '@heroui/react';
import {
  IconBusinessplan,
  IconCards,
  IconChartBar,
  IconFlame,
  IconFlare,
  IconHexagonPlus,
  IconLibraryPhoto,
} from '@tabler/icons-react';
import { configResponsive, useResponsive } from 'ahooks';
import { useLocation, useNavigate } from 'react-router-dom';

configResponsive({
  lg: 1024,
});

function MainMenu() {
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
        icon: IconFlame,
        label: '每周萌王',
        path: '/topWeek',
      },
      {
        key: 'starTower',
        icon: IconFlare,
        label: '通天塔',
        path: '/starTower',
      },
      {
        key: 'character',
        icon: IconBusinessplan,
        label: '角色',
        path: '/character',
      },
      {
        key: 'ico',
        icon: IconHexagonPlus,
        label: 'ICO',
        path: '/ico',
      },
      {
        key: 'ranking',
        icon: IconChartBar,
        label: '排行榜',
        path: '/ranking',
      },
      {
        key: 'lastTemple',
        icon: IconLibraryPhoto,
        label: '最新圣殿',
        path: '/lastTemple',
      },
    ],
    Account: [
      {
        key: 'myTinygrail',
        icon: IconCards,
        label: '我的小圣杯',
        path: '/myTinygrail',
      },
    ],
  };

  return (
    <div className="w-full flex-1 py-2">
      <Listbox aria-label="sidebar main menu" color="secondary" variant="light">
        {Object.entries(menuItems).map(([sectionTitle, items]) => (
          <ListboxSection title={sectionTitle} key={sectionTitle}>
            {items.map((item) => (
              <ListboxItem
                key={item.key}
                onPressEnd={() => {
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
        ))}
      </Listbox>
    </div>
  );
}

export default MainMenu;
