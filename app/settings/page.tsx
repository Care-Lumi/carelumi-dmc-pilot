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
import { Switch } from "@/components/ui/switch"
import { Building2, User, Bell, Shield, Key, CreditCard } from "lucide-react"
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

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    expirationReminders: true,
    complianceUpdates: true,
    weeklyReports: false,
    smsNotifications: false,
  })

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "30",
    passwordLastChanged: "2024-10-15",
  })

  const tabs = [
    { id: "profile", label: "User Profile", icon: User },
    { id: "organization", label: "Organization", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "api", label: "API Access", icon: Key },
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
    console.log("Saving settings:", { adminProfile, orgSettings, notifications, security })
  }

  const handleCancel = () => {
    if (activeTab === "profile") {
      setAdminProfile({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        department: "",
      })
      setAvatarUrl(null)
    } else if (activeTab === "organization") {
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

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB")
      return
    }

    setIsUploadingAvatar(true)

    try {
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

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card className="border border-[#e5e7eb] shadow-sm rounded-[12px]">
              <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#0066FF]" />
                  <CardTitle className="text-[18px] font-semibold">Notification Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Email Alerts</Label>
                      <p className="text-xs text-muted-foreground">Receive email notifications for important updates</p>
                    </div>
                    <Switch
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Expiration Reminders</Label>
                      <p className="text-xs text-muted-foreground">Get notified about expiring credentials</p>
                    </div>
                    <Switch
                      checked={notifications.expirationReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, expirationReminders: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Compliance Updates</Label>
                      <p className="text-xs text-muted-foreground">Stay informed about regulatory changes</p>
                    </div>
                    <Switch
                      checked={notifications.complianceUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, complianceUpdates: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Weekly Reports</Label>
                      <p className="text-xs text-muted-foreground">Receive weekly compliance status reports</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Urgent alerts via text message</p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
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

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card className="border border-[#e5e7eb] shadow-sm rounded-[12px]">
              <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#0066FF]" />
                  <CardTitle className="text-[18px] font-semibold">Security Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-2">Password</Label>
                  <div className="flex items-center gap-4">
                    <Input type="password" value="••••••••••" disabled className="flex-1 bg-muted" />
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last changed: {new Date(security.passwordLastChanged).toLocaleDateString()}
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                  />
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium mb-2">Session Timeout</Label>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    className="w-full rounded-md border border-border bg-card px-4 py-2 text-sm"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatically log out after this period of inactivity
                  </p>
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

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <Card className="border border-[#e5e7eb] shadow-sm rounded-[12px]">
              <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#0066FF]" />
                  <CardTitle className="text-[18px] font-semibold">Billing & Subscription</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <CreditCard className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {org?.tier === "pro" ? "Pro Plan Active" : "Free Trial Active"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {org?.tier === "pro"
                      ? "You're on the Pro plan with full access to all features."
                      : "You're currently on a free trial. Upgrade to unlock all features."}
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline">View Billing History</Button>
                    {org?.tier !== "pro" && <Button>Upgrade to Pro</Button>}
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Quick Links</h4>
                  <div className="grid gap-2">
                    <a href="/revenue-risk" className="text-sm text-primary hover:underline flex items-center gap-2">
                      → View Billing Compliance Dashboard
                    </a>
                    <a href="/integrations" className="text-sm text-primary hover:underline flex items-center gap-2">
                      → Manage Payment Integrations
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Access Tab */}
          {activeTab === "api" && (
            <Card className="border border-[#e5e7eb] shadow-sm rounded-[12px]">
              <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-[#0066FF]" />
                  <CardTitle className="text-[18px] font-semibold">API Access</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Key className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">API Access Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Integrate CareLumi with your own applications and workflows. API access will be available for Pro
                    plan customers.
                  </p>
                  <Button variant="outline">Request API Access</Button>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">What you can do with the API</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Programmatically upload and manage documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Sync credentialing data with your systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Automate compliance workflows</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Access real-time status updates</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
