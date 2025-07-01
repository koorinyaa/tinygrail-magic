import MainMenu from './components/MainMenu';
import SecondaryMenu from './components/SecondaryMenu';
import UpdateNotice from './components/UpdateNotice';
import UserProfile from './components/UserProfile';
import VersionInfo from './components/VersionInfo';

interface NavMenuProps {
  type: 'sidebar' | 'bottombar';
}

function NavMenu({ type = 'sidebar' }: NavMenuProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
      <UserProfile />
      <MainMenu type={type} />
      <SecondaryMenu />
      <UpdateNotice />
      <VersionInfo />
    </div>
  );
}

export default NavMenu;
