import { NextResponse, NextRequest } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

export const POST = async (request: NextRequest) => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { username, name, password } = body

    if (!username || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields: username, name, password" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users_table, { eq }) => eq(users_table.username, username),
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    const token = randomUUID()

    // Create user
    const result = await db
      .insert(users)
      .values({
        username,
        name,
        passwordHash,
        token,
      })
      .returning()

    const createdUser = result[0]

    return NextResponse.json(
      {
        id: createdUser.id,
        username: createdUser.username,
        name: createdUser.name,
        token: createdUser.token,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
