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
import { CharacterSearchDialog } from "./components/character-search-dialog";
import { useStore } from "@/store";
import { useEffect } from "react";
import { LoginDialog } from "./components/ui/login-dialog";

export default function App() {
  const { theme, setTheme } = useStore()

  useEffect(() => {
    // 初始化主题
    setTheme(document.documentElement.getAttribute('data-theme') === "dark" ? "dark" : "light")
  }, [])

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
      <Toaster richColors theme={theme} />
      <CharacterDrawer />
      <CharacterSearchDialog />
      <LoginDialog />
    </div>
  )
}
