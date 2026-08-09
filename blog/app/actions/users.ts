"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { db } from "../../db"
import { users } from "../../db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

export type RegisterUserState = {
  error: string
  username: string
  name: string
  passwordConfirm: string
  success?: boolean
}

export const registerUser = async (
  prevState: RegisterUserState | void,
  formData: FormData,
): Promise<RegisterUserState | void> => {
  const usernameEntry = formData.get("username")
  const nameEntry = formData.get("name")
  const passwordEntry = formData.get("password")
  const passwordConfirmEntry = formData.get("passwordConfirm")

  const username = typeof usernameEntry === "string" ? usernameEntry.trim() : ""
  const name = typeof nameEntry === "string" ? nameEntry.trim() : ""
  const password = typeof passwordEntry === "string" ? passwordEntry : ""
  // The confirmation field is optional for API and E2E form submissions.
  // If it is supplied, it must still match the password.
  const passwordConfirm =
    typeof passwordConfirmEntry === "string" && passwordConfirmEntry.length > 0
      ? passwordConfirmEntry
      : password

  if (username.length < 4) {
    return {
      error: "username must be at least 4 characters long",
      username,
      name,
      passwordConfirm,
    }
  }

  if (password.length < 4) {
    return {
      error: "password must be at least 4 characters long",
      username,
      name,
      passwordConfirm,
    }
  }

  if (password !== passwordConfirm) {
    return {
      error: "passwords do not match",
      username,
      name,
      passwordConfirm,
    }
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  })

  if (existingUser) {
    return {
      error: "username already exists",
      username,
      name,
      passwordConfirm,
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await db.insert(users).values({ username, name, passwordHash })

  return { error: "", username, name, passwordConfirm: "", success: true }
}

export const generateToken = async () => {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const token = randomUUID()

  await db
    .update(users)
    .set({ token })
    .where(eq(users.id, Number(session.user.id)))

  revalidatePath("/me")
}
