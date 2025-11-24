"use client"

import { ElevenLabsWidget } from "@/components/elevenlabs-widget"
import { X } from "lucide-react"

interface ClipVoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ClipVoiceModal({ isOpen, onClose }: ClipVoiceModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Close button positioned independently */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[60] h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Just the widget, centered on screen */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <ElevenLabsWidget />
        </div>
      </div>
    </>
  )
}
