"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { AddProviderToPayerModal } from "@/components/dashboard/add-provider-to-payer-modal"
import { ClipChatModal } from "@/components/dashboard/clip-chat-modal"
import { UpgradeOverlay } from "@/components/upgrade-overlay"
import { UserPlus, RefreshCw, ChevronLeft } from "lucide-react"
import { payerCredentialing } from "@/lib/placeholder-data"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function PayerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  useEffect(() => {
    router.push("/payers")
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}

function PayerDetailContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [payerId, setPayerId] = useState<string>("")
  const [showAddProviderModal, setShowAddProviderModal] = useState(false)
  const [showReCredentialModal, setShowReCredentialModal] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)
  const [showClipModal, setShowClipModal] = useState(false)
  const [showHireModal, setShowHireModal] = useState(false)
  const [showReCredentialOverlay, setShowReCredentialOverlay] = useState(false)
  const [showHireSpecialistOverlay, setShowHireSpecialistOverlay] = useState(false)

  useEffect(() => {
    setPayerId(params.id)
  }, [params.id])

  const payer = payerCredentialing.find((p) => p.id === payerId)

  if (!payerId || !payer) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="flex-1 p-6">
            <p>Payer not found</p>
          </main>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Ready to Submit":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Missing Documents":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600"
      case "under-review":
        return "text-amber-600"
      case "pending":
        return "text-blue-600"
      default:
        return "text-muted-foreground"
    }
  }

  const handleUpload = (providerId: string) => {
    setUploadingFor(providerId)
    // Simulate upload
    setTimeout(() => {
      alert(`Document uploaded for provider ${providerId}`)
      setUploadingFor(null)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-60 mt-16 p-12">
        <div className="mx-auto max-w-[1400px]">
          <Link
            href="/payers"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Payer Credentialing
          </Link>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-foreground">{payer.name}</h1>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddProviderModal(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Provider to Payer
              </Button>
              <Button variant="outline" onClick={() => setShowReCredentialOverlay(true)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-Credential
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
              </CardHeader>
              <CardContent>
                {payer.status === "Active" && <span className="text-sm font-medium text-green-600">Active</span>}
                {payer.status === "In Progress" && (
                  <span className="text-sm font-medium text-amber-600">In Progress</span>
                )}
                {payer.status === "Missing Documents" && (
                  <span className="text-sm font-medium text-destructive-foreground">Missing Documents</span>
                )}
                {payer.status === "Submitted" && <span className="text-sm font-medium text-blue-600">Submitted</span>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Credentialed Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-left">
                  {Array.isArray(payer.providers) ? payer.providers.length : payer.providerCount || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Effective Date</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-left">
                  {payer.status === "Active" ? payer.effectiveDate : "Pending"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Provider Credentialing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Provider Name</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Stage</th>
                      <th className="text-left py-3 px-4">Submission Date</th>
                      {payer.status === "Missing Documents" && (
                        <th className="text-left py-3 px-4">Missing Documents</th>
                      )}
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(payer.providers) && payer.providers.length > 0 ? (
                      payer.providers.map((provider) => (
                        <tr key={provider.id} className="border-b">
                          <td className="py-3 px-4">{provider.name}</td>
                          <td className="py-3 px-4">
                            <span className={`text-sm font-medium ${getStatusTextColor(provider.status)}`}>
                              {provider.status
                                ? provider.status.charAt(0).toUpperCase() + provider.status.slice(1).replace("-", " ")
                                : "Unknown"}
                            </span>
                          </td>
                          <td className="py-3 px-4">{payer.stage}</td>
                          <td className="py-3 px-4">{payer.lastUpdate}</td>
                          {payer.status === "Missing Documents" && (
                            <td className="py-3 px-4">
                              <span className="text-sm text-muted-foreground">{provider.note || "N/A"}</span>
                            </td>
                          )}
                          <td className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setShowClipModal(true)}>Use Clip AI</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowHireSpecialistOverlay(true)}>
                                  Hire Specialist ($65/hr)
                                </DropdownMenuItem>
                                {payer.status === "Missing Documents" && (
                                  <DropdownMenuItem onClick={() => handleUpload(provider.id)}>
                                    Upload Documents
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b">
                        <td className="py-3 px-4" colSpan={payer.status === "Missing Documents" ? 6 : 5}>
                          <p className="text-sm text-muted-foreground text-center">No providers enrolled yet</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AddProviderToPayerModal
        isOpen={showAddProviderModal}
        onClose={() => setShowAddProviderModal(false)}
        payerName={payer.name}
      />

      <ClipChatModal
        isOpen={showClipModal}
        onClose={() => setShowClipModal(false)}
        initialMessage={`Help me complete credentialing for ${payer.name}. Review what documents are needed and suggest next steps.`}
      />

      {showReCredentialOverlay && (
        <UpgradeOverlay
          feature="re-credential"
          title="Contact Sales to Upgrade"
          description="Automate provider re-credentialing with payers. Our premium plan handles re-attestation, updates, and payer communications. Contact our sales team to unlock this feature."
        />
      )}
      {showHireSpecialistOverlay && (
        <UpgradeOverlay
          feature="hire-specialist"
          title="Contact Sales to Upgrade"
          description="Get dedicated credentialing specialists to handle your applications for $65/hour. Contact our sales team to unlock this concierge service."
        />
      )}
    </div>
  )
}
