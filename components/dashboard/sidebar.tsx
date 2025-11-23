"use client"

import type React from "react"

import { useState } from "react"
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
  MessageCircle,
  DollarSign,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ClipChatModal } from "@/components/dashboard/clip-chat-modal"
import { userData } from "@/lib/dmc-pilot-data"

const navigationItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Staff Licenses", href: "/staff", icon: Users },
  { name: "Payer Credentialing", href: "/payers", icon: ShieldCheck },
  { name: "Facilities", href: "/facilities", icon: Building2 },
  { name: "Regulatory Updates", href: "/regulatory", icon: FileText },
  { name: "Documents & Reports", href: "/documents", icon: FolderOpen },
  { name: "Billing Compliance", href: "/revenue-risk", icon: DollarSign },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [showClipChat, setShowClipChat] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Get user initials
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

  const handleAdminClick = () => {
    router.push("/settings?tab=admin")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-200",
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
          <button
            onClick={handleAdminClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              collapsed && "justify-center",
            )}
            title={collapsed ? "Admin Profile" : undefined}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">{getInitials(userData.name)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 truncate text-left">
                <p className="text-sm font-medium text-foreground">{userData.name}</p>
                <p className="text-xs text-muted-foreground">{userData.role}</p>
              </div>
            )}
          </button>

          {/* Chat with Clip */}
          <Button
            variant="outline"
            className={cn("w-full justify-start gap-3", collapsed && "justify-center px-0")}
            title="Chat with Clip"
            onClick={() => setShowClipChat(true)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
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
      <ClipChatModal isOpen={showClipChat} onClose={() => setShowClipChat(false)} />
    </aside>
  )
}
