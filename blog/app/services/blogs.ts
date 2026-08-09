import { eq } from "drizzle-orm"
import { db } from "@/db"
import { blogs, readingList } from "@/db/schema"
import { getCurrentUser } from "./session"

export const getBlogs = async() => {
  return db.query.blogs.findMany()
}


export const addBlogs = async(title: string, author: string, url: string) => {
  const user = await getCurrentUser()
  if (!user){
    throw new Error("not logged in")
  }
  const result = await db.insert(blogs).values({title, author, url, userID: user.id}).returning()
  const newBlog = result[0]
  
  // Add to user's reading list automatically
  await db.insert(readingList).values({
    userId: user.id,
    blogId: newBlog.id,
    read: false,
  })
  
  return newBlog
}

export const getBlogsByID = async(id : number) => {
  return db.query.blogs.findFirst({where: eq(blogs.id, id)})
}

export const incrementLike = async(id : number) => {
  const blog = await getBlogsByID(id)
  if (blog){
    await db
    .update(blogs)
    .set({likes: blog.likes+1})
    .where(eq(blogs.id, id))

  }
}

