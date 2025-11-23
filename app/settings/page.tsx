"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Building2, User } from "lucide-react"

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("profile")

  const [adminProfile, setAdminProfile] = useState({
    firstName: "John",
    lastName: "Cavanagh",
    email: "john@dmc-inc.com",
    phone: "(817) 555-0198",
    jobTitle: "Owner & Medical Director",
    department: "Administration",
    bio: "John Cavanagh is the Owner and Medical Director at DMC Inc, an ambulatory surgery center in Texas. With extensive experience in surgical care and healthcare management, John specializes in ensuring organizational compliance with state and federal regulations, managing credentialing workflows, and maintaining the highest standards of patient care.",
  })

  const tabs = [
    { id: "profile", label: "User Profile", icon: User },
    { id: "organization", label: "Organization", icon: Building2 },
  ]

  useEffect(() => {
    const tabParam = searchParams?.get("tab")
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-60 mt-16 p-8">
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
                  <div className="w-20 h-20 rounded-full bg-[#0066FF] flex items-center justify-center text-white text-2xl font-semibold">
                    JC
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">First Name</Label>
                    <Input
                      value={adminProfile.firstName}
                      onChange={(e) => setAdminProfile({ ...adminProfile, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Last Name</Label>
                    <Input
                      value={adminProfile.lastName}
                      onChange={(e) => setAdminProfile({ ...adminProfile, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Email Address</Label>
                    <Input
                      value={adminProfile.email}
                      type="email"
                      onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Phone Number</Label>
                    <Input
                      value={adminProfile.phone}
                      type="tel"
                      onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Job Title</Label>
                    <Input
                      value={adminProfile.jobTitle}
                      onChange={(e) => setAdminProfile({ ...adminProfile, jobTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Department</Label>
                    <Input
                      value={adminProfile.department}
                      onChange={(e) => setAdminProfile({ ...adminProfile, department: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-[13px] font-medium text-[#333333] mb-2">Bio</Label>
                  <Textarea value={adminProfile.bio} readOnly className="min-h-[100px] bg-[#f9fafb]" />
                  <p className="text-xs text-muted-foreground mt-1">Generated by Clip AI</p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
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
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Organization Name</Label>
                    <Input value="DMC Inc" readOnly className="bg-[#f9fafb]" />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Organization Type</Label>
                    <Input
                      value="Ambulatory Surgery Center"
                      readOnly
                      className="bg-[#f9fafb]"
                    />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Tax ID</Label>
                    <Input value="**-***5892" readOnly className="bg-[#f9fafb]" />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">NPI Number</Label>
                    <Input value="1234567890" readOnly className="bg-[#f9fafb]" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[13px] font-medium text-[#333333] mb-2">Business Address</Label>
                    <Input value="1234 Medical Plaza Dr, Arlington, TX 76010" readOnly className="bg-[#f9fafb]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-[#0066FF] hover:bg-[#0052CC]">Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
