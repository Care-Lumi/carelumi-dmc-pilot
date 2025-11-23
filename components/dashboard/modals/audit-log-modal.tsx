"use client"

import { CheckCircle, Clock, Search, Pen, Mail, Info } from "lucide-react"

interface AuditLogModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuditLogModal({ isOpen, onClose }: AuditLogModalProps) {
  const auditLog: any[] = []
  const renewalMethod = "admin"

  if (!isOpen) return null

  const getIcon = (icon?: string) => {
    switch (icon) {
      case "check-circle":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "check":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "pen":
        return <Pen className="w-5 h-5 text-blue-600" />
      case "search":
        return <Search className="w-5 h-5 text-blue-600" />
      case "mail":
        return <Mail className="w-5 h-5 text-blue-600" />
      default:
        return <Clock className="w-5 h-5 text-blue-600" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-gray-900">Renewal Audit Log</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {auditLog.map((log, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      log.status === "Completed" ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    {getIcon(log.icon)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[14px] font-semibold text-gray-900">{log.action}</h3>
                      <p className="text-[13px] text-gray-600 mt-1">{log.details}</p>
                      {log.user && <p className="text-[12px] text-gray-500 mt-1">By: {log.user}</p>}
                    </div>
                    <span
                      className={`text-[11px] px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                        log.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : log.status === "Processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-2">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {renewalMethod === "admin" && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] text-blue-900">
                  IDFPR processing typically takes 2-4 business days. CareLumi will automatically sync the updated
                  status once it appears in IDFPR system records.
                </p>
              </div>
            </div>
          )}

          {auditLog.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-[14px]">No audit log entries yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
