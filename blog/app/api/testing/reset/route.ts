import { NextResponse } from "next/server"
import { db } from "@/db"
import { blogs, users, readingList } from "@/db/schema"

export const DELETE = async () => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 }
    )
  }

  try {
    await db.delete(readingList)
    await db.delete(blogs)
    await db.delete(users)

    return NextResponse.json(
      { message: "All data deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset database" },
      { status: 500 }
    )
  }
}
