"use client"

import { useState } from "react"
import { Search, Bell, Mic } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NotificationDropdown } from "./notification-dropdown"
import { userData, organizations } from "@/lib/dmc-pilot-data"
import Link from "next/link"

export function TopNav() {
  const [notificationOpen, setNotificationOpen] = useState(false)

  const notifications: any[] = []
  const badgeCount = 0

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <>
      <header className="fixed left-60 right-0 top-0 z-30 h-16 border-b border-border bg-white">
        <div className="flex h-full items-center justify-between px-6">
          {/* Left: Organization name and breadcrumb */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">{userData.organization}</h1>
            <span className="text-muted-foreground">|</span>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>

            {/* Location Selector */}
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-muted-foreground">View:</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-48 h-9">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {organizations.dmcInc.locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right: Search, Notifications, User Menu */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search staff, documents, payers..." className="w-64 pl-9 pr-10 h-9" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-muted rounded p-1 transition-colors">
                <Mic className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Notifications */}
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative h-9 w-9 flex items-center justify-center hover:bg-[#f9fafb] rounded-md transition-colors"
            >
              <Bell className="h-5 w-5 text-[#333333]" />
              {badgeCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white" />
              )}
            </button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">{getInitials(userData.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <NotificationDropdown
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        notifications={notifications}
        onRenewLicense={() => (window.location.href = "/staff")}
        onUploadDocument={() => (window.location.href = "/documents")}
        onNotifyStaff={() => alert("Notification sent to staff member")}
        onReviewRenew={() => {
          setNotificationOpen(false)
        }}
      />
    </>
  )
}
