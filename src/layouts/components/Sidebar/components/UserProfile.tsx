import { User } from '@heroui/react';
import { IconTransfer } from '@tabler/icons-react';

function UserProfile() {
  return (
    <div className="overflow-hidden px-3 py-2">
      <User
        classNames={{
          name: 'max-w-38 truncate',
        }}
        avatarProps={{
          className: 'shrink-0',
          showFallback: true,
          src: 'https://lain.bgm.tv/pic/user/l/000/51/93/519359.jpg?r=1741482675&hd=1',
        }}
        description={
          <div className="flex max-w-38 cursor-pointer items-center gap-1">
            <div className="truncate">余额：₵339.61w</div>
            <IconTransfer className="size-3 shrink-0" />
          </div>
        }
        name="氷Nyaa"
      />
    </div>
  );
}

export default UserProfile;
