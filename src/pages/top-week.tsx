import { CurrentTopWeek } from '@/components/current-top-week';
import { HistoryTopWeek } from '@/components/history-top-week';

export function TopWeek() {
  return (
    <div className="flex flex-col w-full max-w-screen-xl m-auto">
      <div className="flex flex-col xl:gap-x-6 xl:flex-row w-full">
        <CurrentTopWeek />
        <HistoryTopWeek />
      </div>
    </div>
  );
}
