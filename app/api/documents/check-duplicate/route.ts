import { type NextRequest, NextResponse } from "next/server"
import { sql, DMC_ORG_ID } from "@/lib/db"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { licenseNumber, ownerName, expirationDate } = await request.json()

    console.log("[v0] Checking for duplicates/renewals:", { licenseNumber, ownerName, expirationDate })

    if (!licenseNumber || !ownerName) {
      return NextResponse.json({ isDuplicate: false, isRenewal: false })
    }

    // Normalize owner name for matching
    const ownerNormalized = ownerName.toLowerCase().replace(/[^a-z0-9]/g, "")

    // Find matching documents by license number and owner
    const result = await sql`
      SELECT 
        id,
        original_filename as file_name,
        doc_type as document_type,
        owner_name,
        expires_at as expiration_date,
        status,
        created_at
      FROM documents 
      WHERE org_id = ${DMC_ORG_ID}
        AND license_number = ${licenseNumber}
        AND owner_normalized = ${ownerNormalized}
      ORDER BY expires_at DESC
    `

    if (result.length === 0) {
      console.log("[v0] No matching documents found")
      return NextResponse.json({ isDuplicate: false, isRenewal: false })
    }

    // Check if any have the exact same expiration date
    const newExpDate = expirationDate ? new Date(expirationDate).toISOString().split("T")[0] : null

    for (const doc of result) {
      const existingExpDate = doc.expiration_date ? new Date(doc.expiration_date).toISOString().split("T")[0] : null

      if (existingExpDate === newExpDate) {
        // TRUE DUPLICATE - same license, owner, AND expiration
        console.log("[v0] Found true duplicate:", doc)
        return NextResponse.json({
          isDuplicate: true,
          isRenewal: false,
          existingDocument: doc,
        })
      }
    }

    // Not a true duplicate - it's either a renewal or historical upload
    const newestDoc = result[0]
    const newestExpDate = newestDoc.expiration_date ? new Date(newestDoc.expiration_date) : null
    const uploadExpDate = newExpDate ? new Date(newExpDate) : null

    if (newestExpDate && uploadExpDate && uploadExpDate > newestExpDate) {
      // RENEWAL - new expiration is later than existing
      console.log("[v0] This is a renewal (newer expiration)")
      return NextResponse.json({
        isDuplicate: false,
        isRenewal: true,
        existingDocument: newestDoc,
        documentToMarkHistorical: newestDoc.id,
      })
    } else if (newestExpDate && uploadExpDate && uploadExpDate < newestExpDate) {
      // HISTORICAL UPLOAD - new expiration is older
      console.log("[v0] This is a historical upload (older expiration)")
      return NextResponse.json({
        isDuplicate: false,
        isRenewal: false,
        isHistorical: true,
        existingDocument: newestDoc,
      })
    }

    return NextResponse.json({ isDuplicate: false, isRenewal: false })
  } catch (error) {
    console.error("[v0] Error checking for duplicates:", error)
    return NextResponse.json({ error: "Failed to check for duplicates" }, { status: 500 })
  }
}
