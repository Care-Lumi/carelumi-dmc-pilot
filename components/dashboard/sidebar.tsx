"use client"

import type React from "react"
import { useState, createContext, useContext, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useClickTracker } from "@/lib/hooks/use-click-tracker"
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
  MessageSquare,
  Phone,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ClipChatModal } from "@/components/dashboard/clip-chat-modal"
import { ClipVoiceModal } from "@/components/dashboard/clip-voice-modal"
import { ProBadge } from "@/components/pro-badge"
import { useOrg } from "@/lib/contexts/org-context"

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
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true"
    }
    return false
  })
  const [showClipChat, setShowClipChat] = useState(false)
  const [showClipVoice, setShowClipVoice] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { org } = useOrg()
  const { trackClick } = useClickTracker()

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
    trackClick("clip_chat_opened")
    setShowClipChat(true)
  }

  const handleVoiceClick = () => {
    trackClick("clip_voice_opened")
    setShowClipVoice(true)
  }

  const handleLogout = async () => {
    trackClick("logout_clicked")
    // Clear the authentication cookies
    document.cookie = "pilot_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    document.cookie = "org_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"

    // Redirect to login page
    router.push("/pilot-login")
  }

  const toggleCollapsed = () => {
    const newState = !collapsed
    setCollapsed(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(newState))
      window.dispatchEvent(new CustomEvent("sidebar-collapsed-changed", { detail: newState }))
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCollapsed = localStorage.getItem("sidebar-collapsed")
      if (storedCollapsed !== null) {
        setCollapsed(storedCollapsed === "true")
      }
    }
  }, [])

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
                <div className="flex flex-col items-center gap-1">
                  <img src="/images/carelumi-thumbnail-transparent.png" alt="CareLumi" className="h-8 w-8" />
                  {org && <ProBadge tier={org.tier} className="text-[10px] px-1.5 py-0" />}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <img src="/images/carelumi-thumbnail-transparent.png" alt="CareLumi" className="h-10" />
                  {org && <ProBadge tier={org.tier} />}
                </div>
              )}
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="h-8 w-8">
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
                  {org?.primaryContactName ? getInitials(org.primaryContactName) : "?"}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 truncate text-left">
                  <p className="text-sm font-medium text-foreground">{org?.primaryContactName || "Loading..."}</p>
                  <p className="text-xs text-muted-foreground">Owner</p>
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
              <MessageSquare className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm">Chat with Clip</span>}
            </Button>

            {/* Talk with Clip */}
            <Button
              variant="outline"
              className={cn("w-full justify-start gap-3 relative", collapsed && "justify-center px-0")}
              title="Talk with Clip"
              onClick={handleVoiceClick}
            >
              <Phone className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm">Talk with Clip</span>}
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
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-0",
              )}
              title={collapsed ? "Log Out" : undefined}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm">Log Out</span>}
            </Button>
          </div>
        </div>
      </aside>
      <ClipChatModal isOpen={showClipChat} onClose={() => setShowClipChat(false)} />
      <ClipVoiceModal isOpen={showClipVoice} onClose={() => setShowClipVoice(false)} />
    </SidebarContext.Provider>
  )
}
