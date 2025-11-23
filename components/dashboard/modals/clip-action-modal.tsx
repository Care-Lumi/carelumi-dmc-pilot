"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ClipActionModalProps {
  isOpen: boolean
  onClose: () => void
  provider: string
  payer: string
  status: string
}

type StageType = "assessing" | "thinking" | "taking-action" | "reporting"

export function ClipActionModal({ isOpen, onClose, provider, payer, status }: ClipActionModalProps) {
  const [stage, setStage] = useState<StageType>("assessing")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setStage("assessing")
      setProgress(0)
      return
    }

    const stages: StageType[] = ["assessing", "thinking", "taking-action", "reporting"]
    let currentIndex = 0

    const timer = setInterval(() => {
      currentIndex++
      if (currentIndex < stages.length) {
        setStage(stages[currentIndex])
        setProgress((currentIndex / stages.length) * 100)
      } else {
        setProgress(100)
        clearInterval(timer)
      }
    }, 2500)

    return () => clearInterval(timer)
  }, [isOpen])

  const getStageContent = () => {
    switch (stage) {
      case "assessing":
        return {
          title: "Assessing",
          description: `Analyzing ${provider} credentialing status with ${payer}...`,
          icon: "search",
        }
      case "thinking":
        return {
          title: "Thinking",
          description:
            status === "Missing Documents"
              ? "Identified missing CAQH attestation. Best approach: Email payer rep and upload documents to portal..."
              : "Reviewing application timeline. Best approach: Email payer credentialing department for status update...",
          icon: "brain",
        }
      case "taking-action":
        return {
          title: "Taking Action",
          description: `Emailing ${payer} credentialing department... Uploading required documents to provider portal...`,
          icon: "phone",
        }
      case "reporting":
        return {
          title: "Reporting",
          description:
            status === "Missing Documents"
              ? `Emailed ${payer} credentialing rep and uploaded missing CAQH forms via portal. Will call payer if no response in 48 hours. Timeline: 5-7 business days for approval. Follow-up scheduled for 12/2/2025.`
              : `Emailed ${payer} credentialing department. Application is under standard review with no issues identified. Will call for expedited review if needed. Expected completion: 10-15 business days. Follow-up scheduled for 12/5/2025.`,
          icon: "check",
        }
    }
  }

  const content = getStageContent()
  const isComplete = stage === "reporting"

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={isComplete ? handleClose : undefined} />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card shadow-lg">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <span className="text-xl font-bold text-primary-foreground">C</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Clip AI Assistant</h2>
              <p className="text-sm text-muted-foreground">Working on your request</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                {!isComplete && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                {isComplete && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{content.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{content.description}</p>
              </div>
            </div>

            {isComplete && (
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground mb-2">Next Steps</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Clip will monitor the application status</li>
                  <li>• You'll receive updates via email and dashboard notifications</li>
                  <li>• Clip will call the payer if email response is delayed</li>
                  <li>• Estimated resolution: 5-15 business days</li>
                </ul>
              </div>
            )}
          </div>

          {isComplete && (
            <div className="flex justify-end">
              <Button onClick={handleClose}>Close</Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
