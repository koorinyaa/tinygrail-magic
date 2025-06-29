import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Main from './components/Main';

function Layout() {
  return (
    <div className="flex !h-dvh h-screen overflow-hidden bg-content2">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <Header />
        <Main />
      </div>
    </div>
  );
}

export default Layout;
