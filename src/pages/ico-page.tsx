import { ICOPageContent } from '@/components/ico-page-content';
import { RecentICOLog } from '@/components/recent-ico-log';

/**
 * ICO
 */
export function ICOPage() {
  return (
    <div className="flex flex-col w-full max-w-screen-xl m-auto">
      <div className="flex flex-col xl:gap-x-6 xl:flex-row w-full">
        <ICOPageContent />
        <RecentICOLog />
      </div>
    </div>
  );
}
