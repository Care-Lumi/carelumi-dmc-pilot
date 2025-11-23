"use client"

import { useEffect, useRef } from "react"

interface ElevenLabsWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export function ElevenLabsWidget({ isOpen, onClose }: ElevenLabsWidgetProps) {
  const widgetContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return

    // Load ElevenLabs Conversational AI script
    const script = document.createElement('script')
    script.src = 'https://elevenlabs.io/convai-widget/index.js'
    script.async = true
    
    script.onload = () => {
      // Initialize widget when script loads
      if (window.ConvaiWidget && widgetContainerRef.current) {
        window.ConvaiWidget.init({
          agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
          apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY!,
          
          // Widget configuration
          mode: 'inline', // Embed in our modal instead of floating button
          
          // Visual customization (match Vercel blue design)
          primaryColor: '#3b82f6',
          
          // Auto-open when modal opens
          defaultOpen: true,
          
          // Callbacks
          onReady: () => {
            console.log('Clip is ready!')
          },
          onError: (error: Error) => {
            console.error('ElevenLabs widget error:', error)
          },
        })
      }
    }

    document.body.appendChild(script)

    return () => {
      // Cleanup: remove script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      
      // Cleanup ElevenLabs widget instance
      if (window.ConvaiWidget?.destroy) {
        window.ConvaiWidget.destroy()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed right-6 top-6 bottom-6 z-50 w-full max-w-2xl rounded-lg border border-border bg-card shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-primary-foreground">C</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Ask Clip</h2>
              <p className="text-xs text-muted-foreground">AI Compliance Assistant</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close chat"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ElevenLabs Widget Container */}
        <div 
          ref={widgetContainerRef} 
          className="flex-1 overflow-hidden"
          id="elevenlabs-widget-container"
        >
          {/* ElevenLabs widget will be injected here */}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-6 py-3 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            💡 <strong>Tip:</strong> Ask about credentialing requirements, multi-state expansion, or document upload help
          </p>
        </div>
      </div>
    </>
  )
}

// TypeScript declarations for ElevenLabs widget
declare global {
  interface Window {
    ConvaiWidget?: {
      init: (config: {
        agentId: string
        apiKey: string
        mode?: 'inline' | 'float'
        primaryColor?: string
        defaultOpen?: boolean
        onReady?: () => void
        onError?: (error: Error) => void
      }) => void
      destroy?: () => void
    }
  }
}
