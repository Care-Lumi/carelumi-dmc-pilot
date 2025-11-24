"use client"

import type React from "react"
import { useState, createContext, useContext } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Users,
  ShieldCheck,
  Building2,
  FileText,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ClipChatModal } from "@/components/dashboard/clip-chat-modal"
import { Orb } from "@/components/ui/orb"
import { userData } from "@/lib/dmc-pilot-data"

const SidebarContext = createContext<{ collapsed: boolean }>({ collapsed: false })

export function useSidebarCollapsed() {
  return useContext(SidebarContext)
}

const navigationItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Staff Licenses", href: "/staff", icon: Users },
  { name: "Documents & Reports", href: "/documents", icon: FolderOpen },
  { name: "Payer Credentialing", href: "/payers", icon: ShieldCheck },
  { name: "Facilities", href: "/facilities", icon: Building2 },
  { name: "Regulatory Updates", href: "/regulatory", icon: FileText },
  { name: "Billing Compliance", href: "/revenue-risk", icon: DollarSign },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [showClipChat, setShowClipChat] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const handleClipClick = () => {
    setShowClipChat(true)
  }

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              {collapsed ? (
                <img src="/images/carelumi-thumbnail-transparent.png" alt="CareLumi" className="h-8 w-8" />
              ) : (
                <img src="/images/carelumi-thumbnail-transparent.png" alt="CareLumi" className="h-10" />
              )}
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigation}
                  data-tour={
                    item.name === "Staff Licenses"
                      ? "staff-nav"
                      : item.name === "Documents & Reports"
                        ? "documents-nav"
                        : undefined
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "border-l-2 border-primary bg-card text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center",
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border p-2 space-y-2">
            {/* Admin Profile - clickable to go to settings admin tab */}
            <div
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                collapsed && "justify-center",
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 truncate text-left">
                  <p className="text-sm font-medium text-foreground">{userData.name}</p>
                  <p className="text-xs text-muted-foreground">{userData.role}</p>
                </div>
              )}
            </div>

            {/* Chat with Clip */}
            <Button
              data-tour="clip-trigger"
              variant="outline"
              className={cn("w-full justify-start gap-3 relative", collapsed && "justify-center px-0")}
              title="Chat with Clip"
              onClick={handleClipClick}
            >
              <div className="relative flex h-8 w-8 items-center justify-center">
                <Orb colors={["#F6E7D8", "#E0CFC2"]} agentState={null} className="h-8 w-8" />
              </div>
              {!collapsed && <span className="text-sm">Chat with Clip</span>}
            </Button>

            {/* Settings */}
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                collapsed && "justify-center",
              )}
              title={collapsed ? "Settings" : undefined}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Settings</span>}
            </Link>

            {/* Log Out */}
            <button
              className={cn(
                "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                collapsed && "justify-center",
              )}
              title={collapsed ? "Log Out" : undefined}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Log Out</span>}
            </button>
          </div>
        </div>
      </aside>
      <ClipChatModal isOpen={showClipChat} onClose={() => setShowClipChat(false)} />
    </SidebarContext.Provider>
  )
}
