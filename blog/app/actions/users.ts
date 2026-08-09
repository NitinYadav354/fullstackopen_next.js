"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { db } from "../../db"
import { users } from "../../db/schema"
import { eq } from "drizzle-orm"

export type RegisterUserState = {
  error: string
  username: string
  name: string
  passwordConfirm: string
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
  const passwordConfirm =
    typeof passwordConfirmEntry === "string" ? passwordConfirmEntry : ""

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

  redirect("/login")
}