"use server"

import { redirect } from "next/navigation"
import { addBlogs, incrementLike } from "../services/blogs"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"


export const createBlog = async(prevState: {error: string}, formData: FormData) => {
    const session = await auth()
  if (!session) {
    redirect("/login")
  }
    const title = formData.get("title") as string
    if (!title || title.length < 5) {
        return {error: "title must be at least 5 characters long"}
    }
    const author = formData.get("author") as string
    if (!author || author.length < 5) {
        return {error: "author name must be at least 5 characters long"}
    }
    const url = formData.get("url") as string
    if (!url || url.length < 5) {
        return {error: "url must be at least 5 characters long"}
    }

    await addBlogs(title, author, url)
    revalidatePath("/blogs")
    redirect("/blogs")
}

export const IncrementLikes = async(formData: FormData) => {
    const id = Number(formData.get("id"))
    await incrementLike(id)
    revalidatePath(`/blogs/${id}`);
    revalidatePath("/blogs")
    
}
  