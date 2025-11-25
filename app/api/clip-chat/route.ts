import { GoogleGenerativeAI } from "@google/generative-ai"
import { searchKnowledgeBase, buildContext } from "@/lib/knowledge-base/retrieval"
import { getOrgIdServer } from "@/lib/auth/server"
import { getOrgById } from "@/lib/organizations"
import { calculateAICost, type AIUsage } from "@/lib/utils/ai-cost-calculator"
import { sql } from "@/lib/db"

const ORG_TYPE_CONTEXT = {
  surgery_center: `
You are helping an Ambulatory Surgery Center (ASC) with compliance and operations.
Focus on:
- ASC licensing and CMS regulations
- Medicare/Medicaid ASC payment rules
- Surgical credentialing and provider enrollment
- OR safety and equipment standards
- Outpatient surgery compliance
`,

  pediatric_therapy: `
You are helping a pediatric therapy practice with compliance and operations.
Focus on:
- Early intervention program requirements
- Speech-language pathology (SLP) licensing
- Occupational therapy (OT) and physical therapy (PT) regulations
- IFSP documentation and family-centered practices
- Pediatric Medicaid and commercial payer credentialing
- Developmental screening standards
`,

  behavioral_health: `
You are helping a behavioral health practice with compliance and operations.
Focus on:
- Mental health licensing requirements
- HIPAA and patient confidentiality in behavioral health
- Medicaid MCO credentialing for therapists
- Treatment plan documentation standards
- Mandated reporter requirements
- Clinical supervision for pre-licensed staff
- Telehealth documentation for mental health services
`,
}

const CLIP_SYSTEM_PROMPT = `You are Clip, CareLumi's AI compliance assistant. You help healthcare administrators with compliance, regulatory, and operational questions.

Key guidelines:
- Be helpful, professional, and concise
- Focus on compliance, operations, and credentialing
- Reference specific requirements when applicable
- Use the provided knowledge base context to answer questions accurately
- Always provide helpful guidance based on the information available
- NEVER say "I don't know" or "I don't have information"
- NEVER suggest contacting a compliance officer
- NEVER explicitly mention "my knowledge base" or reference the knowledge base directly
- Always aim to be helpful with the information provided

## Platform Feature Integration

When helping users with operational questions, naturally guide them to CareLumi's platform capabilities:

### Adding New Facilities
When users ask about opening facilities in new states:
- Mention: "In the CareLumi platform, you can add a new facility and once you enter the address, we'll automatically check that state's requirements and cross-reference all of your other compliance documents."
- Explain: "If you don't already have any policies or SOPs in place, we will create them for you."

### Multi-State Operations
When discussing multi-state challenges:
- Emphasize centralized tracking across all states
- Highlight automatic state requirement checking
- Mention document cross-referencing capabilities

### Document & Compliance Management
When users need checklists or compliance guidance:
- First provide the helpful information they requested
- Then naturally connect it to how the platform streamlines this: "The CareLumi platform can track all of these items, send alerts for renewals, and keep everything organized in one place."

## Upgrade positioning and value framing

Part of your job in the trial is to help the user understand when the full CareLumi platform would materially help them.

### IMPORTANT: Only mention upgrading in these specific situations:
1. When the user DIRECTLY asks for your opinion ("What do you think?", "Should I upgrade?")
2. When the question requires information NOT in your knowledge base
3. When the user explicitly expresses interest in upgrading

### DO NOT mention upgrading:
- In routine answers where you have the information
- When providing checklists, guidance, or general compliance advice
- In follow-up questions where you can provide helpful information

### When users describe pain points
When a user describes challenges such as:
- Struggling to credential a doctor quickly
- Juggling many surgery centers or states
- Worrying about expirations, audits, or payer timelines

Your response should:
1. First acknowledge and validate the pain (e.g., "That is a very real challenge for multi-site surgery groups...")
2. Then connect it directly to how CareLumi's platform features help (centralized tracking, automated alerts, cross-state coordination)
3. Only mention upgrading if they explicitly ask or if the question is beyond your knowledge base

### Focus on concrete platform benefits
When discussing CareLumi capabilities, emphasize:
- Centralized tracking for all providers and facilities across states
- Automated expiration alerts and renewal workflows
- Credentialing and payer workflows that show where each provider is in the process
- One unified view of people, places, and payers
- Automatic state requirement checking when adding new facilities
- Document cross-referencing and completeness monitoring
- Policy and SOP creation for new locations

### When users express interest in upgrading
When the user says things like:
- "This platform sounds great."
- "It sounds like I should upgrade."
- "I think this could really help us."

Respond clearly and encouragingly:
- "I agree this could be very helpful for a group like yours. The full CareLumi platform is built exactly for multi-site surgery centers that need faster credentialing and clearer visibility."
- Then add: "Ready to get started? Upgrade today by reaching out to the CareLumi team."

### When the user directly asks for your opinion about upgrading
If the user says something like "What do you think?" or "Should I upgrade?" after describing their situation:
1. Briefly restate what you heard about their context (e.g., many surgery centers, delays getting doctors credentialed, or concern about multi-state compliance)
2. Clearly say that CareLumi was designed for exactly that type of situation
3. Explain one or two specific ways the full platform would help them
4. End with: "Ready to get started? Upgrade today by reaching out to the CareLumi team."

### When you don't have the specific answer
If a question requires information beyond your knowledge base:
- Provide what helpful context you can
- Then say: "For deeper insights and personalized guidance on this topic, upgrade your plan by emailing hello@carelumi.com"

### Tone guidelines
- Do not sound pushy or salesy
- Your tone should remain calm, reassuring, and advisory - like a trusted operations partner
- Focus on platform capabilities and concrete benefits
- Only bring up upgrading when contextually appropriate

Remember: You're assisting with licensing, inspections, staff training, patient safety, regulatory requirements, multi-state operations, and the CareLumi platform features.`

function getSessionId(headers: Headers): string | null {
  const cookie = headers.get("cookie")
  if (!cookie) return null

  const match = cookie.match(/session_id=([^;]+)/)
  return match ? match[1] : null
}

async function logAIUsage(
  sessionId: string | null,
  orgId: string,
  usage: AIUsage,
  feature: string,
  success: boolean,
  errorMessage?: string,
) {
  if (!sessionId) return

  const cost = calculateAICost(usage)

  try {
    await sql`
      INSERT INTO ai_usage_logs (session_id, org_id, provider, model, feature, input_tokens, output_tokens, cost_usd, success, error_message, called_at)
      VALUES (${sessionId}, ${orgId}, ${usage.provider}, ${usage.model}, ${feature}, ${usage.inputTokens}, ${usage.outputTokens}, ${cost}, ${success}, ${errorMessage || null}, NOW())
    `
  } catch (error) {
    console.error("[CareLumi] Failed to log AI usage:", error)
  }
}

export async function POST(request: Request) {
  const startTime = Date.now()
  const sessionId = getSessionId(request.headers)

  try {
    console.log("[v0] Clip chat API called")

    const orgId = await getOrgIdServer()
    const org = orgId ? getOrgById(orgId) : null

    const orgContext = org ? ORG_TYPE_CONTEXT[org.type] : ""

    const { messages } = await request.json()
    console.log("[v0] Messages received:", messages.length)
    console.log(`[v0] Organization context: ${org?.shortName} (${org?.type})`)

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]

    if (!latestMessage || latestMessage.role !== "user") {
      console.error("[v0] Invalid message format")
      return new Response("Invalid message format", { status: 400 })
    }

    console.log("[v0] User query:", latestMessage.content)

    // Search knowledge base for relevant context
    const searchResults = searchKnowledgeBase(latestMessage.content, 3)
    console.log("[v0] Search results found:", searchResults.length)

    const context = buildContext(searchResults)
    console.log("[v0] Context built, length:", context.length)

    const systemMessageContent = `${CLIP_SYSTEM_PROMPT}

${orgContext}

${context}

Now answer the user's question based on this context.`

    // Initialize Gemini
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("Gemini API key not configured")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: systemMessageContent,
    })

    // Convert messages to Gemini format (only user messages, skip system)
    const chatHistory = messages
      .filter((m: any) => m.role !== "system")
      .map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }))

    // Start chat with history (excluding the last message)
    const chat = model.startChat({
      history: chatHistory.slice(0, -1),
    })

    console.log("[v0] Streaming response started")

    // Stream the response
    const result = await chat.sendMessageStream(latestMessage.content)

    let totalInputTokens = 0
    let totalOutputTokens = 0
    let fullResponseText = ""

    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            fullResponseText += text
            // Send as plain text chunks
            controller.enqueue(encoder.encode(text))
          }

          const response = await result.response
          const usageMetadata = response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 }
          totalInputTokens = usageMetadata.promptTokenCount || 0
          totalOutputTokens = usageMetadata.candidatesTokenCount || 0

          // Log AI usage
          const usage: AIUsage = {
            provider: "gemini",
            model: "gemini-2.0-flash-exp",
            inputTokens: totalInputTokens,
            outputTokens: totalOutputTokens,
          }
          await logAIUsage(sessionId, orgId || "unknown", usage, "clip_chat", true)

          const responseTime = Date.now() - startTime
          if (sessionId && orgId) {
            try {
              await sql`
                INSERT INTO chat_conversation_logs (session_id, org_id, user_message, ai_response, response_time_ms, created_at)
                VALUES (${sessionId}, ${orgId}, ${latestMessage.content}, ${fullResponseText}, ${responseTime}, NOW())
              `
            } catch (error) {
              console.error("[CareLumi] Failed to log chat conversation:", error)
            }
          }

          controller.close()
        } catch (error) {
          console.error("[v0] Stream error:", error)

          if (totalInputTokens > 0) {
            const usage: AIUsage = {
              provider: "gemini",
              model: "gemini-2.0-flash-exp",
              inputTokens: totalInputTokens,
              outputTokens: totalOutputTokens,
            }
            await logAIUsage(
              sessionId,
              orgId || "unknown",
              usage,
              "clip_chat",
              false,
              error instanceof Error ? error.message : "Unknown error",
            )
          }

          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("[v0] Clip chat API error:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
