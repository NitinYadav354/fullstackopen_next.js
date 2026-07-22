"use server"

import { redirect } from "next/navigation"
import { addBlogs } from "../services/blogs"
import { revalidatePath } from "next/cache"


export const createBlog = async(formData: FormData) => {
    const title = formData.get("title") as string
    const author = formData.get("author") as string
    const url = formData.get("url") as string

    addBlogs(title, author, url)
    revalidatePath("/blogs")
    redirect("/blogs")
}
  