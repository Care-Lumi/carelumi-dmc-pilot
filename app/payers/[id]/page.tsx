"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { AddProviderToPayerModal } from "@/components/dashboard/add-provider-to-payer-modal"
import { ReCredentialModal } from "@/components/dashboard/re-credential-modal"
import { ClipChatModal } from "@/components/dashboard/clip-chat-modal"
import { UserPlus, RefreshCw, ChevronLeft } from "lucide-react"
import { payerCredentialing } from "@/lib/placeholder-data"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function PayerDetailPage({ params }: { params: { id: string } }) {
  return <PayerDetailContent params={params} />
}

function PayerDetailContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [payerId, setPayerId] = useState<string>("")
  const [showAddProviderModal, setShowAddProviderModal] = useState(false)
  const [showReCredentialModal, setShowReCredentialModal] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)
  const [showClipModal, setShowClipModal] = useState(false)
  const [showHireModal, setShowHireModal] = useState(false)

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
              <Button variant="outline" onClick={() => setShowReCredentialModal(true)}>
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
                      <th className="text-left py-3 px-4">Specialty</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Submission Date</th>
                      {payer.status === "Missing Documents" && (
                        <th className="text-left py-3 px-4">Missing Documents</th>
                      )}
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Dr. Sarah Johnson</td>
                      <td className="py-3 px-4">Mental Health</td>
                      <td className="py-3 px-4">
                        {payer.status === "Active" && (
                          <span className="text-sm font-medium text-green-600">Active</span>
                        )}
                        {payer.status === "In Progress" && (
                          <span className="text-sm font-medium text-amber-600">In Progress</span>
                        )}
                        {payer.status === "Missing Documents" && (
                          <span className="text-sm font-medium text-destructive-foreground">Missing Documents</span>
                        )}
                        {payer.status === "Submitted" && (
                          <span className="text-sm font-medium text-blue-600">Submitted</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{payer.submissionDate || "11/15/2025"}</td>
                      {payer.status === "Missing Documents" && (
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">Insurance Certificate, W9</span>
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
                            <DropdownMenuItem onClick={() => setShowHireModal(true)}>
                              Hire Specialist ($65/hr)
                            </DropdownMenuItem>
                            {payer.status === "Missing Documents" && (
                              <DropdownMenuItem onClick={() => handleUpload("provider-1")}>
                                Upload Documents
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Dr. Michael Chen</td>
                      <td className="py-3 px-4">Physical Therapy</td>
                      <td className="py-3 px-4">
                        {payer.status === "Active" && (
                          <span className="text-sm font-medium text-green-600">Active</span>
                        )}
                        {payer.status === "In Progress" && (
                          <span className="text-sm font-medium text-amber-600">In Progress</span>
                        )}
                        {payer.status === "Missing Documents" && (
                          <span className="text-sm font-medium text-destructive-foreground">Missing Documents</span>
                        )}
                        {payer.status === "Submitted" && (
                          <span className="text-sm font-medium text-blue-600">Submitted</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{payer.submissionDate || "11/15/2025"}</td>
                      {payer.status === "Missing Documents" && (
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">Background Check</span>
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
                            <DropdownMenuItem onClick={() => setShowHireModal(true)}>
                              Hire Specialist ($65/hr)
                            </DropdownMenuItem>
                            {payer.status === "Missing Documents" && (
                              <DropdownMenuItem onClick={() => handleUpload("provider-2")}>
                                Upload Documents
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
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

      <ReCredentialModal
        isOpen={showReCredentialModal}
        onClose={() => setShowReCredentialModal(false)}
        payerName={payer.name}
      />

      <ClipChatModal
        isOpen={showClipModal}
        onClose={() => setShowClipModal(false)}
        initialMessage={`Help me complete credentialing for ${payer.name}. Review what documents are needed and suggest next steps.`}
      />

      {showHireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-card p-6 shadow-lg max-w-md">
            <h3 className="text-lg font-semibold mb-4">Hire Credentialing Specialist</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A CareLumi credentialing specialist will take over this application for $65/hour. They'll handle all
              documentation, follow-ups, and payer communications.
            </p>
            <p className="text-sm font-medium mb-6">Estimated time: 3-5 hours ($195-$325 total)</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowHireModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert("Request submitted! A specialist will contact you within 24 hours.")
                  setShowHireModal(false)
                }}
              >
                Request Specialist
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
