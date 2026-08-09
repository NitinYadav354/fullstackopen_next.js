"use client"

import { useTransition } from "react"
import { addBlogToReadingList } from "../actions/blogs"
import { useNotification } from "./NotificationContext"

export default function AddToReadingListButton({ blogId }: { blogId: number }) {
  const [isPending, startTransition] = useTransition()
  const { showNotification } = useNotification()

  const addToReadingList = () => {
    startTransition(async () => {
      try {
        await addBlogToReadingList(blogId)
        showNotification("Added to reading list")
      } catch {
        showNotification("Could not add blog to reading list", "error")
      }
    })
  }

  return (
    <button type="button" onClick={addToReadingList} disabled={isPending}>
      {isPending ? "Adding..." : "Add to reading list"}
    </button>
  )
}
