"use client"

import { useState } from "react"

interface RequestDocumentsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RequestDocumentsModal({ isOpen, onClose }: RequestDocumentsModalProps) {
  const [allStaff, setAllStaff] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<string[]>([])
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [customDoc, setCustomDoc] = useState("")
  const [message, setMessage] = useState("")
  const [deliveryEmail, setDeliveryEmail] = useState(true)
  const [deliverySMS, setDeliverySMS] = useState(false)

  if (!isOpen) return null

  const staffList = [
    { id: "martinez", name: "Dr. Sarah Martinez" },
    { id: "smith", name: "Jane Smith, LCSW" },
    { id: "davis", name: "John Davis, PhD" },
    { id: "lee", name: "Sarah Lee, LCPC" },
    { id: "chen", name: "Michael Chen, PsyD" },
  ]

  const documentTypes = [
    "CPR Certification",
    "TB Test",
    "Background Check",
    "Professional License",
    "Liability Insurance",
  ]

  const toggleStaff = (staffId: string) => {
    setSelectedStaff((prev) => (prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]))
  }

  const toggleDoc = (doc: string) => {
    setSelectedDocs((prev) => (prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]))
  }

  const handleSend = () => {
    console.log("[v0] Sending document request:", {
      allStaff,
      selectedStaff: allStaff ? "all" : selectedStaff,
      documents: [...selectedDocs, customDoc].filter(Boolean),
      message,
      delivery: { email: deliveryEmail, sms: deliverySMS },
    })
    alert("Document request sent! Staff will receive unique upload links.")
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[700px] bg-white rounded-lg shadow-lg z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Request Documents</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium mb-3">Send To</label>
            <div className="mb-3">
              <label className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                <input
                  type="checkbox"
                  checked={allStaff}
                  onChange={(e) => {
                    setAllStaff(e.target.checked)
                    if (e.target.checked) setSelectedStaff([])
                  }}
                />
                <span className="text-sm font-medium">All staff with missing documents</span>
              </label>
            </div>
            {!allStaff && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">Or select individual staff:</div>
                {staffList.map((staff) => (
                  <label
                    key={staff.id}
                    className="flex items-center gap-2 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(staff.id)}
                      onChange={() => toggleStaff(staff.id)}
                    />
                    <span className="text-sm">{staff.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Document Types */}
          <div>
            <label className="block text-sm font-medium mb-3">Documents to Request</label>
            <div className="space-y-2">
              {documentTypes.map((doc) => (
                <label
                  key={doc}
                  className="flex items-center gap-2 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
                >
                  <input type="checkbox" checked={selectedDocs.includes(doc)} onChange={() => toggleDoc(doc)} />
                  <span className="text-sm">{doc}</span>
                </label>
              ))}
              <input
                type="text"
                placeholder="Custom document type..."
                value={customDoc}
                onChange={(e) => setCustomDoc(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to include with the request..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm resize-none"
            />
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium mb-3">Delivery Method</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                <input type="checkbox" checked={deliveryEmail} onChange={(e) => setDeliveryEmail(e.target.checked)} />
                <span className="text-sm">Email</span>
              </label>
              <label className="flex items-center gap-2 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                <input type="checkbox" checked={deliverySMS} onChange={(e) => setDeliverySMS(e.target.checked)} />
                <span className="text-sm">SMS</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={
              (!allStaff && selectedStaff.length === 0) ||
              (selectedDocs.length === 0 && !customDoc) ||
              (!deliveryEmail && !deliverySMS)
            }
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send Request
          </button>
        </div>
      </div>
    </>
  )
}
