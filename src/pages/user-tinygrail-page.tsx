import { UserTinygrail } from '@/components/user-tinygrail';
import { useStore } from '@/store';

/**
 * 我的小圣杯
 */
export function UserTinygrailPage() {
  const { currentPage } = useStore();

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col xl:gap-x-6 xl:flex-row w-full">
        <UserTinygrail userName={currentPage?.data?.userName || ''} />
      </div>
    </div>
  );
}
