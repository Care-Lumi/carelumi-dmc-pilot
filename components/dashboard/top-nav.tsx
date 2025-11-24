"use client"

import { useState } from "react"
import { Search, HelpCircle, Mic } from "lucide-react"
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
  const [showSearchToast, setShowSearchToast] = useState(false)

  const notifications: any[] = []

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleRestartTour = () => {
    localStorage.removeItem("carelumi_dmc_onboarding_seen")
    window.dispatchEvent(new CustomEvent("restartOnboarding"))
  }

  const handleSearchClick = () => {
    console.log("[v0] Search bar clicked")
    setShowSearchToast(true)
    setTimeout(() => setShowSearchToast(false), 5000)
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
            <div className="flex items-center gap-2 ml-4" data-tour="location-selector">
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

          {/* Right: Search, Product Tour, Help, User Menu */}
          <div className="flex items-center gap-4">
            <div className="relative" data-tour="search-bar">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Global search and voice search (available on paid plans)"
                className="w-80 pl-9 pr-10 h-9 cursor-not-allowed"
                readOnly
                onClick={handleSearchClick}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 transition-colors cursor-not-allowed"
                disabled
              >
                <Mic className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <Button variant="outline" onClick={handleRestartTour} className="h-9 text-sm bg-transparent">
              Product Tour
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 p-0">
                  <HelpCircle className="h-5 w-5 text-[#333333]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <a href="mailto:hello@carelumi.com">Contact Support</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getInitials(userData.name)}
                    </AvatarFallback>
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

        {showSearchToast && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-auto w-fit">
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 shadow-lg">
              <p className="text-sm text-blue-900">
                Global search is part of the paid version. For this pilot, open "Chat with Clip" in the sidebar to ask
                compliance questions.
              </p>
            </div>
          </div>
        )}
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
