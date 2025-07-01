function Header() {
  return (
    <header className="bg-content1 lg:bg-content2 sticky top-0 z-10 shadow-sm transition-all duration-300 ease-in-out lg:shadow-none">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:border-b lg:border-neutral-200">
          <div className="text-default-500 hover:text-default-600 block cursor-pointer lg:hidden"></div>
        </div>
      </div>
    </header>
  );
}

export default Header;
