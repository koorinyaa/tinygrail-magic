import { CharacterPageContent } from '@/components/character-page-content';
import { RecentCharacterLog } from '@/components/recent-character-log';

/**
 * 角色
 */
export function CharacterPage() {
  return (
    <div className="flex flex-col w-full max-w-screen-xl m-auto">
      <div className="flex flex-col xl:gap-x-6 xl:flex-row w-full">
        <CharacterPageContent />
        <RecentCharacterLog />
      </div>
    </div>
  );
}
