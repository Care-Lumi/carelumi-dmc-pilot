import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, JPG, or PNG files.' },
        { status: 400 }
      )
    }

    // Convert file to base64 for Gemini
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')

    // Get file MIME type
    const mimeType = file.type

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Prepare the prompt for classification
    const prompt = `You are analyzing a healthcare compliance document. Extract structured information in JSON format.

Identify:
1. Document type (look for headers like "Medical License", "DEA Certificate", "Facility Permit", "Insurance Card", "Certification", "Background Check")
2. Issuing jurisdiction (state, regulatory body name)
3. License/certificate number
4. Provider or facility name
5. Issue and expiration dates (look for dates in MM/DD/YYYY or similar formats)
6. Any renewal requirements or conditions listed

Return ONLY valid JSON matching this exact schema:
{
  "documentType": "Medical License" | "DEA Certificate" | "Facility Permit" | "Insurance Card" | "Certification" | "Background Check" | "Other",
  "jurisdiction": {
    "state": "string (e.g., Texas, Illinois)",
    "issuingBody": "string (e.g., Texas Medical Board)"
  },
  "identifiers": {
    "licenseNumber": "string",
    "providerName": "string (or null)",
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
  "nextActions": [
    "array of recommended actions like 'Renewal required by DATE'"
  ]
}

If you cannot determine a field, use null. Be precise with dates and numbers.`

    // Call Gemini API
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      },
      prompt
    ])

    const response = await result.response
    const text = response.text()

    // Parse JSON from response
    let classification
    try {
      // Remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      classification = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text)
      return NextResponse.json(
        { 
          error: 'Failed to classify document. Please try again or contact support.',
          rawResponse: text 
        },
        { status: 500 }
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
        classification.compliance.warnings.push('EXPIRED - Cannot use for billing')
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
        processedAt: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Document classification error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process document. Please try again.',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// Configure API route
export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we'll use formData
  },
}
