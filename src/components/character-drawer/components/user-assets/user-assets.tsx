import { ActionButtons } from './action-buttons';
import { AssetsInfo } from './assets-info';
import { Items } from '../items';
import { LinkButton } from './link-button';
import { UserTempleCard } from './user-temple-card';

/**
 * 用户资产
 */
export function UserAssets() {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-row relative">
        <UserTempleCard />
        <LinkButton />
        <AssetsInfo />
      </div>
      <ActionButtons />
      <Items />
    </div>
  );
}
