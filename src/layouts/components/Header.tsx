import { createLayoutStore } from '@/stores';
import { TbLayoutSidebarRight } from 'react-icons/tb';

function Header() {
  const { toggleSidebar } = createLayoutStore();

  return (
    <header className="bg-content1 lg:bg-content2 sticky top-0 z-10 shadow-sm lg:shadow-none">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:border-b lg:border-neutral-200">
          <div className="text-default-500 hover:text-default-600 block cursor-pointer lg:hidden">
            <TbLayoutSidebarRight className="size-6" onClick={toggleSidebar} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
