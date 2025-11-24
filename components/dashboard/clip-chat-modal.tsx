"use client"
import { Orb } from "@/components/ui/orb"
import type React from "react"
import ReactMarkdown from "react-markdown"

import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef, useEffect } from "react"

interface ClipChatModalProps {
  isOpen: boolean
  onClose: () => void
  initialContext?: string
}

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export function ClipChatModal({ isOpen, onClose, initialContext }: ClipChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    console.log("[v0] Sending message:", userMessage.content)
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/clip-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error:", errorText)
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No response body")
      }

      const assistantMessageId = (Date.now() + 1).toString()
      let fullText = ""

      // Add empty assistant message that we'll update
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant" as const,
          content: "",
        },
      ])

      // Read plain text stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log("[v0] Stream complete")
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk

        // Update the assistant message with accumulated text
        setMessages((prev) => prev.map((m) => (m.id === assistantMessageId ? { ...m, content: fullText } : m)))
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const suggestedPrompts = [
    "What should I upload first for our Texas surgery centers?",
    "Explain what the trial version of CareLumi can and cannot do.",
    "How will CareLumi handle expiring licenses once we upgrade?",
    "Walk me through a checklist for opening a new ASC in Texas.",
    "Where in the platform do I go to see staff licenses vs facility documents?",
  ]

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      <div className="fixed right-6 top-6 bottom-6 z-50 w-full max-w-2xl rounded-lg border border-border bg-card shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <Orb colors={["#F6E7D8", "#E0CFC2"]} agentState={isLoading ? "thinking" : null} className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Ask Clip</h2>
              <p className="text-xs text-muted-foreground">AI Compliance Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                This is a trial preview of Clip. Answers are high-level and are not connected to your live data during
                the free trial.
              </div>

              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex h-24 w-24 items-center justify-center mb-6">
                  <Orb colors={["#F6E7D8", "#E0CFC2"]} agentState={null} className="h-24 w-24" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Start a conversation</h3>
                <p className="text-sm text-muted-foreground mb-8">Type a message below</p>
              </div>

              {/* Suggested Questions */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Suggested questions:</p>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 items-center justify-center flex-shrink-0 mt-1">
                  <Orb colors={["#F6E7D8", "#E0CFC2"]} agentState={null} className="h-8 w-8" />
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-3 max-w-[80%] ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown
                    className="text-sm leading-relaxed prose prose-sm max-w-none
                      prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1
                      prose-strong:font-semibold prose-strong:text-foreground
                      prose-ul:list-disc prose-ul:pl-4
                      prose-ol:list-decimal prose-ol:pl-4"
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-8 w-8 items-center justify-center flex-shrink-0">
                <Orb colors={["#F6E7D8", "#E0CFC2"]} agentState="thinking" className="h-8 w-8" />
              </div>
              <div className="rounded-lg px-4 py-3 bg-muted">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-border p-4 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about compliance, documents, or CareLumi features..."
              className="resize-none min-h-[48px] max-h-[120px] flex-1"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-[48px] w-[48px] flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
        </form>
      </div>
    </>
  )
}
