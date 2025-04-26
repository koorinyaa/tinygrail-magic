import { Tinygrail } from "@/components/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { formatCurrency, getAvatarUrl } from "@/lib/utils"
import { useStore } from "@/store"
import {
  BadgeCent,
  ChartNoAxesColumn,
  CircleUserRound,
  ExternalLink,
  Images,
  Settings,
  Sparkles,
  Trophy
} from "lucide-react"
import {
  NavProjects,
  NavSecondary
} from "./sidebar-navigation"
import { NavUpdate } from "./sidebar-navigation/nav-update"

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userAssets, updateInfo } = useStore();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const data = {
    navPages: {
      groupName: "Pages",
      items: [
        {
          name: "每周萌王",
          id: "topWeek",
          icon: Trophy,
        },
        {
          name: "通天塔",
          id: "starTower",
          icon: Sparkles,
        },
        {
          name: "最新圣殿",
          id: "latestTemples",
          icon: Images,
        },
        {
          name: "市场",
          id: "market",
          icon: BadgeCent,
        },
        {
          name: "排行榜",
          id: "ranking",
          icon: ChartNoAxesColumn,
        },
      ],
    },
    navAccount: {
      groupName: "Account",
      items: [
        {
          name: `${'氷Nyaa'}的小圣杯`,
          id: "account",
          icon: CircleUserRound,
        },
        {
          name: "设置",
          id: "settings",
          icon: Settings,
        },
      ],
    },
    navSecondary: [
      {
        title: "fuyuake",
        url: "https://fuyuake.top",
        target: "_blank",
        icon: ExternalLink,
      },
      {
        title: "返回bangumi",
        url: currentPath,
        icon: ExternalLink,
      },
    ],
    user: {
      name: userAssets?.name || "",
      nickname: userAssets?.nickname || "",
      balance: formatCurrency(userAssets?.balance || 0),
      avatar: getAvatarUrl(userAssets?.avatar || ""),
    },
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Tinygrail className="size-full" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">小圣杯</span>
                  <span className="truncate text-xs">TinyGrail Exchange Plugin</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.navPages} />
        <NavProjects projects={data.navAccount} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {
        updateInfo?.hasUpdate &&
        <SidebarFooter className="mb-1">
          {/* <NavUser user={data.user} /> */}
          <NavUpdate />
        </SidebarFooter>
      }
    </Sidebar>
  )
}
