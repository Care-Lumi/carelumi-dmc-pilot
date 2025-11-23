"use client"

import { useState } from "react"

interface ClipChatModalProps {
  isOpen: boolean
  onClose: () => void
  initialContext?: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ClipChatModal({ isOpen, onClose, initialContext }: ClipChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: initialContext
        ? `Hi! I'm Clip, your AI compliance assistant. ${initialContext}`
        : "Hi! I'm Clip, your AI compliance assistant. I can help you with staff credentials, payer credentialing, audit readiness, regulatory compliance, and more. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  if (!isOpen) return null

  const suggestedPrompts = [
    "What do I need for a CARF audit?",
    "Show me what's missing for State DCFS compliance",
    "Send reminders for missing CPR certifications",
    "Create a 4-week timeline to reach 100% readiness",
  ]

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let responseContent = ""

    if (input.toLowerCase().includes("carf")) {
      responseContent = `Based on CARF accreditation standards, you'll need:

**Staff Requirements (8 items):**
- Professional licenses
- Background checks
- Training certifications
- Supervision documentation

**Facility Requirements (6 items):**
- Safety inspections
- Accessibility compliance
- Emergency procedures

**Documentation (11 items):**
- Quality improvement plans
- Outcome measurement data
- Rights and responsibilities policies

Your current readiness: **72%** (18 of 25 items). You're missing 7 items. Would you like me to create a timeline to address these?`
    } else if (input.toLowerCase().includes("missing") || input.toLowerCase().includes("dcfs")) {
      responseContent = `For State DCFS compliance, here's what needs attention:

**Missing Items (3):**
1. ⚠️ CPR certifications for 2 staff members
2. ⚠️ Emergency evacuation plan needs update
3. ⚠️ Re-credentialing for 3 providers

**Actions I can take:**
- Send email/SMS reminders to affected staff
- Schedule recurring tasks for document uploads
- Generate template forms

Would you like me to send reminders now?`
    } else if (input.toLowerCase().includes("reminder") || input.toLowerCase().includes("send")) {
      responseContent = `✅ **Reminders sent successfully!**

Sent to:
- Dr. Sarah Johnson - CPR certification needed
- Mark Chen, RN - CPR certification needed

Each staff member received:
- Email with unique upload link
- SMS notification
- 7-day deadline

I'll track their progress and send follow-up reminders in 3 days if not completed.`
    } else if (input.toLowerCase().includes("timeline") || input.toLowerCase().includes("week")) {
      responseContent = `**4-Week Timeline to 100% Readiness:**

**Week 1: Staff Compliance**
- Collect missing CPR certifications
- Complete background check renewals
- Milestone: 82% ready

**Week 2: Facility Updates**
- Update emergency evacuation plan
- Schedule fire safety inspection
- Milestone: 91% ready

**Week 3: Provider Re-credentialing**
- Submit re-credentialing applications
- Update CAQH profiles
- Milestone: 95% ready

**Week 4: Final Review**
- Audit all documentation
- Generate audit package
- Milestone: 100% ready

I can create calendar events and send weekly check-ins. Should I proceed?`
    } else {
      responseContent = `I understand you're asking about "${input}". I can help with:

- Identifying specific audit requirements (CARF, State DCFS, Fire Safety, etc.)
- Showing your current readiness percentage and what's missing
- Sending automated reminders to staff for missing documents
- Creating timelines with weekly milestones
- Generating audit packages

What would you like me to help with?`
    }

    const assistantMessage: Message = { role: "assistant", content: responseContent }
    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed right-6 top-6 bottom-6 z-50 w-full max-w-2xl rounded-lg border border-border bg-card shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-primary-foreground">C</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Ask Clip</h2>
              <p className="text-xs text-muted-foreground">AI Compliance Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border border-border"
                }`}
              >
                <p className="whitespace-pre-line text-sm">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-lg border border-border bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            </div>
          )}

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try asking:</p>
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="block w-full rounded-lg border border-border bg-card px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Clip anything about compliance..."
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
