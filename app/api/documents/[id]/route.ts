import { type NextRequest, NextResponse } from "next/server"
import { sql, DMC_ORG_ID } from "@/lib/db"
import { del } from "@vercel/blob"

export const runtime = "nodejs"

// DELETE /api/documents/[id] - Delete a document
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // First, get the document to retrieve the blob URL
    const [document] = await sql`
      SELECT file_url FROM documents WHERE id = ${id} AND org_id = ${DMC_ORG_ID}
    `

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Delete from blob storage (optional - can keep for audit trail)
    try {
      await del(document.file_url)
      console.log("[v0] Deleted file from blob storage:", document.file_url)
    } catch (blobError) {
      console.warn("[v0] Failed to delete from blob (may not exist):", blobError)
      // Continue anyway - database deletion is more important
    }

    // Delete from database
    await sql`
      DELETE FROM documents WHERE id = ${id} AND org_id = ${DMC_ORG_ID}
    `

    console.log("[v0] Document deleted:", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting document:", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}
