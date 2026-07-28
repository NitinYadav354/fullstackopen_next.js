import { eq } from "drizzle-orm"
import { db } from "@/db"
import { blogs } from "@/db/schema"

export const getBlogs = async() => {
  return db.query.blogs.findMany()
}


export const addBlogs = async(title: string, author: string, url: string) => {
  await db.insert(blogs).values({title, author, url})
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

