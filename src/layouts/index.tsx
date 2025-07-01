import BottomBar from './components/BottomBar';
import Header from './components/Header';
import Main from './components/Main';
import Sidebar from './components/Sidebar';

function Layout() {
  return (
    <div className="bg-content2 flex !h-dvh h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <Header />
        <Main />
        <BottomBar />
      </div>
    </div>
  );
}

export default Layout;
