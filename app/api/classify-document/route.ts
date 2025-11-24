import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { generateText } from "ai"

const CLASSIFICATION_PROMPT = `You are analyzing a healthcare compliance document. Extract structured information in JSON format.

IMPORTANT RULES:
1. Return ONLY ONE JSON object (never an array), even if multiple licenses appear in the same document
2. If multiple licenses for DIFFERENT people appear, set maybe_multiple_documents: true
3. If the same license appears multiple times (full + wallet size), treat as ONE license
4. Make your best guess for every field - NEVER use "Not specified" or leave fields empty
5. For owner_type, determine if this is a:
   - "staff": Individual professional license (MD, RN, OT, PT, therapist, etc.)
   - "facility": Location/building permit, facility license, ASC license
   - "payer": Insurance contract, payer enrollment, credentialing agreement

Return ONLY valid JSON matching this exact schema:
{
  "documentType": "Medical License" | "DEA Certificate" | "Facility Permit" | "Insurance Card" | "Certification" | "Background Check" | "Other",
  "ownerType": "staff" | "facility" | "payer",
  "jurisdiction": {
    "state": "string (e.g., Texas, Illinois)",
    "issuingBody": "string (e.g., Texas Medical Board)"
  },
  "identifiers": {
    "licenseNumber": "string",
    "providerName": "string (full name if staff license)",
    "facilityName": "string (or null)",
    "npiNumber": "string (or null)"
  },
  "validity": {
    "issueDate": "YYYY-MM-DD (or null)",
    "expirationDate": "YYYY-MM-DD (or null)",
    "isExpired": boolean,
    "daysUntilExpiration": number (or null)
  },
  "compliance": {
    "isValid": boolean,
    "missingInfo": ["array of missing fields"],
    "warnings": ["array of warnings like 'Expires soon'"]
  },
  "maybe_multiple_documents": boolean,
  "nextActions": [
    "array of recommended actions like 'Renewal required by DATE'"
  ]
}

If the document contains licenses for multiple different people:
- Set maybe_multiple_documents: true
- Set ownerType: "organization"
- Set providerName: "Multiple staff members"

If you cannot determine a field, make your best educated guess based on context. Be precise with dates and numbers.`

async function classifyWithGemini(file: File, base64Data: string, mimeType: string) {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("Gemini API key not configured")

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    },
    CLASSIFICATION_PROMPT,
  ])

  const response = await result.response
  return response.text()
}

async function classifyWithOpenAI(base64Data: string, mimeType: string) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw new Error("AI Gateway API key not configured")
  }

  const { text } = await generateText({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: `data:${mimeType};base64,${base64Data}`,
          },
          {
            type: "text",
            text: CLASSIFICATION_PROMPT,
          },
        ],
      },
    ],
  })

  return text
}

async function classifyWithClaude(base64Data: string, mimeType: string) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw new Error("AI Gateway API key not configured")
  }

  const { text } = await generateText({
    model: "anthropic/claude-sonnet-4",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: `data:${mimeType};base64,${base64Data}`,
          },
          {
            type: "text",
            text: CLASSIFICATION_PROMPT,
          },
        ],
      },
    ],
  })

  return text
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload PDF, JPG, or PNG files." }, { status: 400 })
    }

    // Convert file to base64 for AI processing
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString("base64")
    const mimeType = file.type

    let responseText: string
    let usedProvider = "Gemini"

    try {
      console.log("[v0] Attempting classification with Gemini...")
      responseText = await classifyWithGemini(file, base64Data, mimeType)
    } catch (geminiError) {
      console.warn(
        "[v0] Gemini failed, trying OpenAI...",
        geminiError instanceof Error ? geminiError.message : geminiError,
      )

      try {
        usedProvider = "OpenAI"
        responseText = await classifyWithOpenAI(base64Data, mimeType)
      } catch (openaiError) {
        console.warn(
          "[v0] OpenAI failed, trying Claude...",
          openaiError instanceof Error ? openaiError.message : openaiError,
        )

        try {
          usedProvider = "Claude"
          responseText = await classifyWithClaude(base64Data, mimeType)
        } catch (claudeError) {
          console.error(
            "[v0] All AI providers failed",
            claudeError instanceof Error ? claudeError.message : claudeError,
          )
          throw new Error("All AI classification services are unavailable. Please try again later.")
        }
      }
    }

    console.log(`[v0] Successfully classified document using ${usedProvider}`)

    // Parse JSON from response
    let classification
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

      classification = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("[v0] Failed to parse AI response:", responseText)
      return NextResponse.json(
        {
          error: "Failed to classify document. Please try again or contact support.",
          rawResponse: responseText,
        },
        { status: 500 },
      )
    }

    // Calculate days until expiration if we have an expiration date
    if (classification.validity?.expirationDate) {
      const expDate = new Date(classification.validity.expirationDate)
      const today = new Date()
      const diffTime = expDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      classification.validity.daysUntilExpiration = diffDays
      classification.validity.isExpired = diffDays < 0

      // Add warnings based on expiration
      if (diffDays < 0) {
        classification.compliance.warnings.push("EXPIRED - Cannot use for billing")
        classification.compliance.isValid = false
      } else if (diffDays <= 30) {
        classification.compliance.warnings.push(`Expires in ${diffDays} days - URGENT renewal required`)
      } else if (diffDays <= 60) {
        classification.compliance.warnings.push(`Expires in ${diffDays} days - Renewal recommended`)
      }
    }

    // Return classification result
    return NextResponse.json({
      success: true,
      classification,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        processedAt: new Date().toISOString(),
        aiProvider: usedProvider,
      },
    })
  } catch (error: any) {
    console.error("[v0] Document classification error:", error)

    return NextResponse.json(
      {
        error: "Failed to process document. Please try again.",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// Configure API route
export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we'll use formData
  },
}
