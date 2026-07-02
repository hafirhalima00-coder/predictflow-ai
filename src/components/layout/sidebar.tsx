"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Brain,
  GitCompare,
  FileText,
  ShieldCheck,
  Timeline,
  Bell,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useNotificationStore } from "@/services/notification-service"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/simulation", label: "Simulation", icon: Brain },
  { href: "/comparison", label: "Comparison", icon: GitCompare },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/approval", label: "Approvals", icon: ShieldCheck },
  { href: "/timeline", label: "Timeline", icon: Timeline },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <TooltipProvider key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                {item.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </nav>
  )

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col border-r bg-background p-3 lg:w-56">
        <div className="mb-6 flex items-center gap-2 px-2 pt-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="hidden text-lg font-bold lg:inline">PredictFlow</span>
        </div>
        {nav}
        <div className="mt-auto flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative justify-start gap-3"
                  onClick={() => {}}
                >
                  <Bell className="h-4 w-4" />
                  <span className="hidden lg:inline">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground lg:static lg:ml-auto">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-3"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="hidden lg:inline">{theme === "dark" ? "Light" : "Dark"} Mode</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                Toggle Theme
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>

      <div className="fixed right-4 top-4 z-50 lg:hidden">
        <Button variant="outline" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="fixed left-0 top-0 h-full w-56 bg-background p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center gap-2 px-2 pt-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">PredictFlow</span>
            </div>
            {nav}
          </div>
        </div>
      )}
    </>
  )
}
