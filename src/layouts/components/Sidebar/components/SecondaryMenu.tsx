import { createAppStore } from '@/stores';
import { restorePage } from '@/utils/initializers';
import { Listbox, ListboxItem } from '@heroui/react';
import { TbLink } from 'react-icons/tb';

function SecondaryMenu() {
  const { hideApp } = createAppStore();
  const menuItems = [
    {
      key: 'fuyuake',
      icon: TbLink,
      label: 'fuyuake',
      onPressEnd: () => {
        window.open('https://fuyuake.top');
      },
    },
    {
      key: 'bangumi',
      icon: TbLink,
      label: '返回bangumi',
      onPressEnd: () => {
        restorePage();
        hideApp();
      },
    },
  ];

  return (
    <div className="w-full py-2">
      <Listbox aria-label="sidebar secondary menu" color="secondary" variant="light">
        {menuItems.map((item) => (
          <ListboxItem
            key={item.key}
            onPressEnd={item.onPressEnd}
            startContent={<item.icon className="size-5" />}
          >
            {item.label}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
}

export default SecondaryMenu;
