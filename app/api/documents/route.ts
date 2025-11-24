import { type NextRequest, NextResponse } from "next/server"
import { sql, DMC_ORG_ID } from "@/lib/db"
import { put } from "@vercel/blob"
import { decorateWithDerivedFields } from "@/lib/utils/document-helpers"

export const runtime = "nodejs"

// GET /api/documents - Fetch all documents for the org
export async function GET(request: NextRequest) {
  try {
    const result = await sql`
      SELECT 
        id,
        file_url,
        original_filename as file_name,
        doc_type as document_type,
        owner_name,
        owner_type,
        expires_at as expiration_date,
        license_number,
        jurisdiction,
        status,
        created_at,
        updated_at
      FROM documents 
      WHERE org_id = ${DMC_ORG_ID} 
      ORDER BY created_at DESC
    `

    const documentsWithDerivedFields = result.map((doc: any) => decorateWithDerivedFields(doc))

    return NextResponse.json({ documents: documentsWithDerivedFields })
  } catch (error) {
    console.error("[v0] Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

// POST /api/documents - Save a new document
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const docType = formData.get("docType") as string
    const ownerType = formData.get("ownerType") as string
    const ownerName = formData.get("ownerName") as string | null
    const jurisdiction = formData.get("jurisdiction") as string | null
    const licenseNumber = formData.get("licenseNumber") as string | null
    const expiresAt = formData.get("expiresAt") as string | null
    const classificationRaw = formData.get("classificationRaw") as string | null
    const documentToMarkHistorical = formData.get("documentToMarkHistorical") as string | null
    const saveAsHistorical = formData.get("saveAsHistorical") === "true"

    console.log("[v0] Received document data:", {
      docType,
      ownerType,
      ownerName,
      expiresAt,
      jurisdiction,
      licenseNumber,
      documentToMarkHistorical,
      saveAsHistorical,
    })

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    // Generate document ID
    const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    let expirationDate: Date | null = null
    if (expiresAt) {
      try {
        expirationDate = new Date(expiresAt)
        if (isNaN(expirationDate.getTime())) {
          console.error("[v0] Invalid expiration date:", expiresAt)
          expirationDate = null
        } else {
          console.log("[v0] Parsed expiration date:", expirationDate.toISOString())
        }
      } catch (e) {
        console.error("[v0] Error parsing expiration date:", e)
      }
    }

    const ownerNormalized = ownerName ? ownerName.toLowerCase().replace(/[^a-z0-9]/g, "") : null

    const status = saveAsHistorical ? "historical" : "active"

    if (documentToMarkHistorical) {
      await sql`
        UPDATE documents
        SET status = 'historical'
        WHERE id = ${documentToMarkHistorical}
      `
      console.log("[v0] Marked old document as historical:", documentToMarkHistorical)
    }

    // Insert into database
    await sql`
      INSERT INTO documents (
        id, org_id, file_url, original_filename,
        doc_type, owner_type, owner_name, owner_normalized,
        jurisdiction, license_number, expires_at, 
        classification_raw, status
      ) VALUES (
        ${docId}, 
        ${DMC_ORG_ID}, 
        ${blob.url}, 
        ${file.name},
        ${docType}, 
        ${ownerType}, 
        ${ownerName},
        ${ownerNormalized},
        ${jurisdiction},
        ${licenseNumber}, 
        ${expirationDate ? expirationDate.toISOString() : null},
        ${classificationRaw ? JSON.parse(classificationRaw) : null},
        ${status}
      )
    `

    console.log("[v0] Document saved to database with ID:", docId, "status:", status)

    // If owner_name exists, upsert into respective table
    if (ownerName && ownerType === "staff") {
      const staffId = `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await sql`
        INSERT INTO staff (id, org_id, name, status)
        VALUES (${staffId}, ${DMC_ORG_ID}, ${ownerName}, 'active')
        ON CONFLICT (org_id, name) DO NOTHING
      `
      console.log("[v0] Staff member created/updated:", ownerName)
    } else if (ownerName && ownerType === "facility") {
      const facilityId = `fac_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await sql`
        INSERT INTO facilities (id, org_id, name, state, status)
        VALUES (${facilityId}, ${DMC_ORG_ID}, ${ownerName}, ${jurisdiction}, 'active')
        ON CONFLICT (org_id, name) DO NOTHING
      `
    } else if (ownerName && ownerType === "payer") {
      const payerId = `payer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await sql`
        INSERT INTO payers (id, org_id, name, status)
        VALUES (${payerId}, ${DMC_ORG_ID}, ${ownerName}, 'active')
        ON CONFLICT (org_id, name) DO NOTHING
      `
    }

    // Fetch the created document with mapped field names
    const [document] = await sql`
      SELECT 
        id,
        file_url,
        original_filename as file_name,
        doc_type as document_type,
        owner_name,
        owner_type,
        expires_at as expiration_date,
        license_number,
        jurisdiction,
        status,
        created_at
      FROM documents 
      WHERE id = ${docId}
    `

    console.log("[v0] Returning document:", document)
    return NextResponse.json({ document })
  } catch (error) {
    console.error("[v0] Error saving document:", error)
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 })
  }
}
