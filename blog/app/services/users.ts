import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users, blogs } from "@/db/schema"

export const getUsers = async() => {
  return db.query.users.findMany()
}

export const getUserById = async(username: string) => {
  return db.query.users.findFirst({where: eq(users.username, username)})
}

export const getBlogsbyUserId = async(userID: number) => {
    return db.query.blogs.findMany({
        where: eq(blogs.userID, userID)
    })
}

export const getUsersWithBlogs = async(username : string) => {
    return db.query.users.findFirst({
        where: eq(users.username, username),
        with: {blogs: true}
    })
}