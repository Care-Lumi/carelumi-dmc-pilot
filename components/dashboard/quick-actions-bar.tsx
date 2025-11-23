"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Mail } from "lucide-react"
import { UploadDocumentsModal } from "./upload-documents-modal"
import { GenerateAuditModal } from "./generate-audit-modal"
import { RequestDocumentsModal } from "./request-documents-modal"

export function QuickActionsBar() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [auditModalOpen, setAuditModalOpen] = useState(false)
  const [requestModalOpen, setRequestModalOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Upload Documents Button */}
        <Button
          variant="outline"
          className="h-10 px-4 gap-2 text-sm font-medium border border-border hover:border-primary transition-colors bg-transparent"
          onClick={() => setUploadModalOpen(true)}
        >
          <Upload className="h-4 w-4" />
          Upload Documents
        </Button>

        {/* Generate Audit Package Button */}
        <Button
          variant="outline"
          className="h-10 px-4 gap-2 text-sm font-medium border border-border hover:border-primary transition-colors bg-transparent"
          onClick={() => setAuditModalOpen(true)}
        >
          <FileText className="h-4 w-4" />
          Generate Audit
        </Button>

        {/* Request Documents Button */}
        <Button
          variant="outline"
          className="h-10 px-4 gap-2 text-sm font-medium border border-border hover:border-primary transition-colors bg-transparent"
          onClick={() => setRequestModalOpen(true)}
        >
          <Mail className="h-4 w-4" />
          Request Documents
        </Button>
      </div>

      <UploadDocumentsModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <GenerateAuditModal isOpen={auditModalOpen} onClose={() => setAuditModalOpen(false)} />
      <RequestDocumentsModal isOpen={requestModalOpen} onClose={() => setRequestModalOpen(false)} />
    </>
  )
}
