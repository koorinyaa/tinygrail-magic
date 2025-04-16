import { CharacterDrawer } from "@/components/character-drawer";
import AppSidebar from "@/components/layout/app-sidebar/app-sidebar";
import Header from "@/components/layout/header/header";
import { MainContent } from "@/components/layout/main-content/main-content";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import './App.css';
import { useAppState } from "./components/app-state-provider";
import { CharacterSearchDialog } from "./components/character-search-dialog";

export default function App() {
  const { state } = useAppState();

  return (
    <div
      className="w-screen h-(--vh-screen) overflow-hidden"
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <Header />
          <MainContent />
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors theme={state.theme} />
      <CharacterDrawer />
      <CharacterSearchDialog />
    </div>
  )
}
