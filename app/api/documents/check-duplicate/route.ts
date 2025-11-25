import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getOrgIdServer } from "@/lib/auth/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  console.log("[v0] check-duplicate API called")

  try {
    const orgId = await getOrgIdServer()
    if (!orgId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 401 })
    }

    const body = await request.json()
    const { licenseNumber, ownerName, expirationDate } = body

    console.log("[v0] Checking for duplicates/renewals:", { licenseNumber, ownerName, expirationDate })

    if (!licenseNumber || !ownerName) {
      console.log("[v0] Missing required fields, returning no duplicate")
      return NextResponse.json({ isDuplicate: false, isRenewal: false, isHistorical: false })
    }

    // Normalize owner name for matching
    const ownerNormalized = ownerName.toLowerCase().replace(/[^a-z0-9]/g, "")
    console.log("[v0] Normalized owner name:", ownerNormalized)

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
      WHERE org_id = ${orgId}
        AND license_number = ${licenseNumber}
        AND owner_normalized = ${ownerNormalized}
      ORDER BY expires_at DESC
    `

    console.log("[v0] Found matching documents:", result.length)

    if (result.length === 0) {
      console.log("[v0] No matching documents found")
      return NextResponse.json({ isDuplicate: false, isRenewal: false, isHistorical: false })
    }

    // Check if any have the exact same expiration date
    const newExpDate = expirationDate ? new Date(expirationDate).toISOString().split("T")[0] : null
    console.log("[v0] New document expiration date:", newExpDate)

    for (const doc of result) {
      const existingExpDate = doc.expiration_date ? new Date(doc.expiration_date).toISOString().split("T")[0] : null
      console.log("[v0] Comparing with existing doc:", { id: doc.id, expDate: existingExpDate })

      if (existingExpDate === newExpDate) {
        // TRUE DUPLICATE - same license, owner, AND expiration
        console.log("[v0] Found true duplicate:", doc.id)
        return NextResponse.json({
          isDuplicate: true,
          isRenewal: false,
          isHistorical: false,
          existingDocument: doc,
        })
      }
    }

    // Not a true duplicate - it's either a renewal or historical upload
    const newestDoc = result[0]
    const newestExpDate = newestDoc.expiration_date ? new Date(newestDoc.expiration_date) : null
    const uploadExpDate = newExpDate ? new Date(newExpDate) : null

    console.log("[v0] Comparing dates - newest existing:", newestExpDate, "new upload:", uploadExpDate)

    if (newestExpDate && uploadExpDate && uploadExpDate > newestExpDate) {
      // RENEWAL - new expiration is later than existing
      console.log("[v0] This is a renewal (newer expiration)")
      return NextResponse.json({
        isDuplicate: false,
        isRenewal: true,
        isHistorical: false,
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

    console.log("[v0] No duplicate/renewal/historical status detected")
    return NextResponse.json({ isDuplicate: false, isRenewal: false, isHistorical: false })
  } catch (error) {
    console.error("[v0] Error checking for duplicates:", error)
    // Return JSON error instead of letting it bubble up as HTML
    return NextResponse.json(
      {
        error: "Failed to check for duplicates",
        details: error instanceof Error ? error.message : String(error),
        isDuplicate: false,
        isRenewal: false,
        isHistorical: false,
      },
      { status: 500 },
    )
  }
}
