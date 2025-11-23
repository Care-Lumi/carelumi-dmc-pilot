"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { ChevronLeft, Search, Mic, RefreshCcw, HelpCircle } from "lucide-react"
import { revenueAtRiskDetails } from "@/lib/placeholder-data"
import { ClipActionModal } from "@/components/dashboard/modals/clip-action-modal"

function RevenueRiskContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [providerFilter, setProviderFilter] = useState("all")
  const [payerFilter, setPayerFilter] = useState("all")
  const [clipModalOpen, setClipModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<(typeof revenueAtRiskDetails)[0] | null>(null)

  const totalAtRisk = revenueAtRiskDetails.reduce((sum, item) => sum + item.atRisk, 0)
  const totalProviders = new Set(revenueAtRiskDetails.map((item) => item.provider)).size
  const avgDaysBlocked = Math.round(
    revenueAtRiskDetails.reduce((sum, item) => sum + item.daysBlocked, 0) / revenueAtRiskDetails.length,
  )

  const providers = Array.from(new Set(revenueAtRiskDetails.map((item) => item.provider)))
  const payers = Array.from(new Set(revenueAtRiskDetails.map((item) => item.payer)))

  const filteredData = revenueAtRiskDetails.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.payer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProvider = providerFilter === "all" || item.provider === providerFilter
    const matchesPayer = payerFilter === "all" || item.payer === payerFilter
    return matchesSearch && matchesProvider && matchesPayer
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In-Progress":
        return "text-amber-600"
      case "Missing Documents":
        return "text-destructive-foreground"
      default:
        return "text-green-600"
    }
  }

  const handleUseClip = (item: (typeof revenueAtRiskDetails)[0]) => {
    setSelectedItem(item)
    setClipModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />
      <main className="ml-60 mt-16 p-12">
        <div className="mx-auto max-w-[1400px] space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-semibold text-foreground">Billing Compliance</h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Estimated monthly revenue currently blocked due to credentialing or documentation issues.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Track blocked revenue and credentialing delays</p>
            </div>
            <Button variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Sync with RCM
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue at Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive-foreground">${totalAtRisk.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Providers Unable to Bill </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive-foreground">{totalProviders}</div>
                <p className="text-xs text-muted-foreground mt-1">Blocked from billing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Days Blocked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{avgDaysBlocked}</div>
                <p className="text-xs text-muted-foreground mt-1">In credentialing process</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search providers or payers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              <Mic className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={payerFilter} onValueChange={setPayerFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Payers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payers</SelectItem>
                {payers.map((payer) => (
                  <SelectItem key={payer} value={payer}>
                    {payer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Provider</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Payer</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Applied</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Monthly Average Billing</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Days Blocked</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Amount at Risk</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="font-medium">{item.provider}</div>
                        </td>
                        <td className="px-6 py-4">{item.payer}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(item.appliedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">${item.monthlyAverage.toLocaleString()}</td>
                        <td className="px-6 py-4">{item.daysBlocked} days</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold">${item.atRisk.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm" onClick={() => handleUseClip(item)}>
                            Use Clip
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredData.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No results found for the selected filters.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {selectedItem && (
        <ClipActionModal
          isOpen={clipModalOpen}
          onClose={() => {
            setClipModalOpen(false)
            setSelectedItem(null)
          }}
          provider={selectedItem.provider}
          payer={selectedItem.payer}
          status={selectedItem.status}
        />
      )}
    </div>
  )
}

export default function RevenueRiskPage() {
  return <RevenueRiskContent />
}
