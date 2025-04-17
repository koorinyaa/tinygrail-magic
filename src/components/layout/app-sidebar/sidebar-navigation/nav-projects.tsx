import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStore } from "@/store";

type NavProjectsProps = {
  projects: {
    groupName: string;
    items: item[];
  };
};

type item = {
  name: string;
  id: string;
  icon: LucideIcon;
};

export function NavProjects({ projects }: NavProjectsProps) {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  const { currentPage, setCurrentPage } = useStore()

  const handleClick = (item: item) => {
    setCurrentPage({
      main: {
        title: item.name,
        id: item.id,
      },
    });

    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{projects.groupName}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              isActive={item.id === currentPage.main.id}
              onClick={() => handleClick(item)}
            >
              <div className="cursor-pointer">
                <item.icon />
                <span>{item.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
