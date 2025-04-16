import { Moon, Sun } from "lucide-react"

import { useAppState } from "@/components/app-state-provider"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export function ThemeToggle({ ...props }) {
  const { state, dispatch } = useAppState()

  useEffect(() => {
    // 更新网页主题
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(state.theme)
    document.documentElement.setAttribute("data-theme", state.theme);
    document.cookie = `chii_theme=${state.theme}; path=/; max-age=31536000`;

    // 更新网页主题色
    const meta: HTMLMetaElement | null = document.getElementById("theme-color-meta") as HTMLMetaElement;
    if (meta) {
      meta.content = state.theme === "dark" ? "#020618" : "#FFFFFF";
    } else {
      const themeColorMeta = document.createElement("meta");
      themeColorMeta.name = "theme-color";
      themeColorMeta.id = "theme-color-meta";
      themeColorMeta.content = state.theme === "dark" ? "#020618" : "#FFFFFF";
      document.head.appendChild(themeColorMeta);
    }
  }, [state.theme])

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      payload: state.theme === "light" ? "dark" : "light",
    });
  }

  return (
    <div>
      <Button {...props} onClick={toggleTheme}>
        {state.theme === "light" ? <Moon /> : <Sun />}
      </Button>
    </div>
  )
}
