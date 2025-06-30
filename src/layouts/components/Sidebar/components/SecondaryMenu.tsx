import { goBackToBangumi } from '@/utils/initializers';
import { Listbox, ListboxItem } from '@heroui/react';
import { TbLink } from 'react-icons/tb';

function SecondaryMenu() {
  const menuItems = [
    {
      key: 'fuyuake',
      icon: TbLink,
      label: 'fuyuake',
      onPress: () => {
        window.open('https://fuyuake.top');
      },
    },
    {
      key: 'bangumi',
      icon: TbLink,
      label: '返回bangumi',
      onPress: () => {
        goBackToBangumi();
      },
    },
  ];

  return (
    <div className="w-full py-2">
      <Listbox aria-label="sidebar secondary menu" color="secondary" variant="light">
        {menuItems.map((item) => (
          <ListboxItem
            key={item.key}
            onPress={item.onPress}
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
