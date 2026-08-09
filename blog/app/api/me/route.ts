import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    )
  }

  const token = authHeader.slice(7) // Remove "Bearer " prefix

  if (!token) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    )
  }

  const user = await db.query.users.findFirst({
    where: eq(users.token, token),
    with: {
      blogs: true,
    },
  })

  if (!user) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    )
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    name: user.name,
    createdBlogs: user.blogs,
  })
}
