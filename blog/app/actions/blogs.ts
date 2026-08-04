"use server"

import { redirect } from "next/navigation"
import { addBlogs, incrementLike } from "../services/blogs"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export type BlogFormState = {
    error: string
    title: string
    author: string
    url: string
}

export const createBlog = async (
    prevState: BlogFormState,
    formData: FormData,
): Promise<BlogFormState> => {
    const titleEntry = formData.get("title")
    const authorEntry = formData.get("author")
    const urlEntry = formData.get("url")

    const title = typeof titleEntry === "string" ? titleEntry : ""
    const author = typeof authorEntry === "string" ? authorEntry : ""
    const url = typeof urlEntry === "string" ? urlEntry : ""

    const session = await auth()
    if (!session) {
        redirect("/login")
    }

    if (title.length < 5) {
        return {
            error: "title must be at least 5 characters long",
            title,
            author,
            url,
        }
    }

    if (author.length < 5) {
        return {
            error: "author name must be at least 5 characters long",
            title,
            author,
            url,
        }
    }

    if (url.length < 5) {
        return {
            error: "url must be at least 5 characters long",
            title,
            author,
            url,
        }
    }

    await addBlogs(title, author, url)
    revalidatePath("/blogs")
    redirect("/blogs")
}

export const IncrementLikes = async (formData: FormData) => {
    const id = Number(formData.get("id"))
    await incrementLike(id)
    revalidatePath(`/blogs/${id}`)
    revalidatePath("/blogs")
}
