"use client"

import { useState } from "react"
import { X, Mail, FileText, RefreshCw, MessageSquare } from "lucide-react"
import { ClipChatModal } from "./clip-chat-modal"
import Image from "next/image"

interface StaffActionsModalProps {
  isOpen: boolean
  onClose: () => void
  staffMember: {
    id: string
    name: string
    email?: string
    phone?: string
  }
}

export function StaffActionsModal({ isOpen, onClose, staffMember }: StaffActionsModalProps) {
  const [showClipChat, setShowClipChat] = useState(false)
  const [showLicenseImage, setShowLicenseImage] = useState(false)

  if (!isOpen) return null

  const handleNotify = () => {
    alert(`Notification sent to ${staffMember.name}`)
    onClose()
  }

  const handleViewExpiredLicense = () => {
    setShowLicenseImage(true)
  }

  const handleRenew = () => {
    alert("Renewal flow started")
    onClose()
  }

  const handleAskClip = () => {
    setShowClipChat(true)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-lg bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Actions for {staffMember.name}</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleNotify}
              className="flex w-full items-center gap-3 rounded-md border border-border bg-background p-4 text-left hover:bg-muted transition-colors"
            >
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">Notify Staff Member</div>
                <div className="text-sm text-muted-foreground">Send renewal reminder via email</div>
              </div>
            </button>

            <button
              onClick={handleViewExpiredLicense}
              className="flex w-full items-center gap-3 rounded-md border border-border bg-background p-4 text-left hover:bg-muted transition-colors"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">View Expiring License</div>
                <div className="text-sm text-muted-foreground">View current license document</div>
              </div>
            </button>

            <button
              onClick={handleRenew}
              className="flex w-full items-center gap-3 rounded-md border border-border bg-background p-4 text-left hover:bg-muted transition-colors"
            >
              <RefreshCw className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">Renew License</div>
                <div className="text-sm text-muted-foreground">Start renewal process</div>
              </div>
            </button>

            <button
              onClick={handleAskClip}
              className="flex w-full items-center gap-3 rounded-md border border-border bg-background p-4 text-left hover:bg-muted transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">Ask Clip</div>
                <div className="text-sm text-muted-foreground">Get AI assistance</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {showLicenseImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
          onClick={() => setShowLicenseImage(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] overflow-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLicenseImage(false)}
              className="absolute top-6 right-6 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <X className="h-6 w-6" />
            </button>
            <Image
              src="/images/screenshot-202025-11-21-20at-201.png"
              alt="Samuel Osei Boateng Illinois OTA License"
              width={1200}
              height={1600}
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      <ClipChatModal
        isOpen={showClipChat}
        onClose={() => {
          setShowClipChat(false)
          onClose()
        }}
        initialContext={`I need help with ${staffMember.name}'s license renewal. Their Illinois Occupational Therapy Assistant license (#057.005783) expires on 12/31/2025.`}
      />
    </>
  )
}
