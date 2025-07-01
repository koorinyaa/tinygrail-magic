import { Card, CardBody, Chip } from '@heroui/react';

interface UpdateNoticeProps {
  show?: boolean;
}

function UpdateNotice({ show = true }: UpdateNoticeProps) {
  if (!show) return null;

  return (
    <div className="pt-2 pb-4">
      <Card isPressable shadow="sm" className="w-full" onPress={() => console.log('item pressed')}>
        <CardBody>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">发现新版本</p>
            <Chip
              classNames={{
                base: 'bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30',
                content: 'drop-shadow shadow-black text-white',
              }}
              variant="shadow"
            >
              New
            </Chip>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default UpdateNotice;
