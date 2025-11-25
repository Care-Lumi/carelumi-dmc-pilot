"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Building2, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOrg } from "@/lib/contexts/org-context"

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true"
    }
    return false
  })
  const [activeTab, setActiveTab] = useState("profile")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const [adminProfile, setAdminProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "",
  })

  const [orgSettings, setOrgSettings] = useState({
    name: "",
    type: "",
    taxId: "",
    npi: "",
    address: "",
  })

  const tabs = [
    { id: "profile", label: "User Profile", icon: User },
    { id: "organization", label: "Organization", icon: Building2 },
  ]

  const { org } = useOrg()

  useEffect(() => {
    if (org) {
      setOrgSettings({
        name: org.fullName,
        type: org.type,
        taxId: "",
        npi: "",
        address: "",
      })
      setAdminProfile({
        firstName: org.primaryContact.name.split(" ")[0] || "",
        lastName: org.primaryContact.name.split(" ").slice(1).join(" ") || "",
        email: org.primaryContact.email,
        phone: "",
        jobTitle: "",
        department: "",
      })
    }
  }, [org])

  useEffect(() => {
    const tabParam = searchParams?.get("tab")
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  useEffect(() => {
    const handleCollapsedChange = (e: CustomEvent) => {
      setCollapsed(e.detail)
    }
    window.addEventListener("sidebar-collapsed-changed" as any, handleCollapsedChange)
    return () => {
      window.removeEventListener("sidebar-collapsed-changed" as any, handleCollapsedChange)
    }
  }, [])

  const handleSave = () => {
    // TODO: Implement save to database
    console.log("Saving settings:", { adminProfile, orgSettings })
  }

  const handleCancel = () => {
    // Reset to empty or refetch from database
    if (activeTab === "profile") {
      setAdminProfile({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        department: "",
      })
      setAvatarUrl(null) // Reset avatar URL on cancel
    } else {
      setOrgSettings({
        name: "",
        type: "",
        taxId: "",
        npi: "",
        address: "",
      })
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB")
      return
    }

    setIsUploadingAvatar(true)

    try {
      // Upload to Blob storage
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { url } = await response.json()
      setAvatarUrl(url)
      console.log("[v0] Avatar uploaded successfully:", url)
    } catch (error) {
      console.error("[v0] Avatar upload error:", error)
      alert("Failed to upload avatar. Please try again.")
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className={cn("mt-16 p-8 transition-all duration-300", collapsed ? "ml-16" : "ml-60")}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* User Profile */}
          {activeTab === "profile" && (
            <Card className="border border-[#e5e7eb] shadow-sm rounded-[12px]">
              <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#0066FF]" />
                  <CardTitle className="text-[18px] font-semibold">User Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#0066FF] flex items-center justify-center text-white text-2xl font-semibold">
                      {adminProfile.firstName && adminProfile.lastName
                        ? `${adminProfile.firstName[0]}${adminProfile.lastName[0]}`
                        : "?"}
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">First Name</Label>
                    <Input
                      placeholder="Enter first name"
                      value={adminProfile.firstName}
                      onChange={(e) => setAdminProfile({ ...adminProfile, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Last Name</Label>
                    <Input
                      placeholder="Enter last name"
                      value={adminProfile.lastName}
                      onChange={(e) => setAdminProfile({ ...adminProfile, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Email Address</Label>
                    <Input
                      placeholder="Enter email"
                      value={adminProfile.email}
                      type="email"
                      onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Phone Number</Label>
                    <Input
                      placeholder="Enter phone number"
                      value={adminProfile.phone}
                      type="tel"
                      onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Job Title</Label>
                    <Input
                      placeholder="Enter job title"
                      value={adminProfile.jobTitle}
                      onChange={(e) => setAdminProfile({ ...adminProfile, jobTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Department</Label>
                    <Input
                      placeholder="Enter department"
                      value={adminProfile.department}
                      onChange={(e) => setAdminProfile({ ...adminProfile, department: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="default" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Organization Settings */}
          {activeTab === "organization" && (
            <Card className="border border-[#e5e7eb] shadow-sm rounded-[12px]">
              <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-[#0066FF]" />
                  <CardTitle className="text-[18px] font-semibold">Organization Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Organization Name</Label>
                    <Input
                      placeholder="Organization name"
                      value={orgSettings.name}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Organization name cannot be changed</p>
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Primary Contact Name</Label>
                    <Input
                      placeholder="Enter primary contact name"
                      value={`${adminProfile.firstName} ${adminProfile.lastName}`}
                      onChange={(e) => {
                        const names = e.target.value.split(" ")
                        setAdminProfile({
                          ...adminProfile,
                          firstName: names[0] || "",
                          lastName: names.slice(1).join(" ") || "",
                        })
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Primary Contact Email</Label>
                    <Input
                      placeholder="Enter primary contact email"
                      value={adminProfile.email}
                      type="email"
                      onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="default" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
