"use client"

import { useEffect, useState } from "react"

interface AIProcessingModalProps {
  isOpen?: boolean
  onClose?: () => void
  onComplete?: () => void
}

export function AIProcessingModal({ isOpen = false, onClose, onComplete }: AIProcessingModalProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              onComplete?.()
            }, 500)
            return 100
          }
          return prev + 20
        })
      }, 600)

      return () => clearInterval(interval)
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl p-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>

          <div>
            <h3 className="text-[18px] font-semibold mb-2">Processing License Document</h3>
            <p className="text-[14px] text-gray-600">AI is extracting information from the license...</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-2 text-[13px] text-gray-600">
            <div className={progress >= 20 ? "text-green-600 font-medium" : ""}>
              {progress >= 20 ? "✓" : "•"} Scanning document...
            </div>
            <div className={progress >= 40 ? "text-green-600 font-medium" : ""}>
              {progress >= 40 ? "✓" : "•"} Extracting license information...
            </div>
            <div className={progress >= 60 ? "text-green-600 font-medium" : ""}>
              {progress >= 60 ? "✓" : "•"} Verifying with IDFPR database...
            </div>
            <div className={progress >= 80 ? "text-green-600 font-medium" : ""}>
              {progress >= 80 ? "✓" : "•"} Validating credentials...
            </div>
            <div className={progress >= 100 ? "text-green-600 font-medium" : ""}>
              {progress >= 100 ? "✓" : "•"} Complete!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
