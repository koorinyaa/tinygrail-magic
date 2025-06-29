import { ORIGINAL_URL_STORAGE_KEY } from '@/constants';
import { Listbox, ListboxItem } from '@heroui/react';
import { IconLink } from '@tabler/icons-react';

function SecondaryMenu() {
  const menuItems = [
    {
      key: 'fuyuake',
      icon: IconLink,
      label: 'fuyuake',
      path: 'https://fuyuake.top',
    },
    {
      key: 'bangumi',
      icon: IconLink,
      label: '返回bangumi',
      path: sessionStorage.getItem(ORIGINAL_URL_STORAGE_KEY) || '',
    },
  ];

  return (
    <div className="w-full py-2">
      <Listbox aria-label="sidebar secondary menu" color="secondary" variant="light">
        {menuItems.map((item) => (
          <ListboxItem
            key={item.key}
            onPressEnd={() => {
              try {
                // 检查是否同域名
                const url = new URL(item.path);
                if (url.hostname === window.location.hostname) {
                  window.location.href = item.path;
                  window.location.reload();
                } else {
                  window.open(item.path);
                }
              } catch (e) {
                window.open(item.path);
              }
            }}
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
