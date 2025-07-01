import { Avatar, Button } from '@heroui/react';

function BarAvatar({ onPress }: { onPress: () => void }) {
  return (
    <Button className="size-12" isIconOnly radius="full" variant="faded" onPress={onPress}>
      <Avatar
        classNames={{ base: 'size-full pointer-events-none' }}
        showFallback
        src={'https://lain.bgm.tv/pic/user/c/000/51/93/519359.jpg?r=1741482675&hd=1'}
      />
    </Button>
  );
}

export default BarAvatar;
