import Link from "next/link"
import { getBlogsByID } from "@/app/services/blogs"
import { IncrementLikes, addBlogToReadingList } from "@/app/actions/blogs"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/db"
import { readingList } from "@/db/schema"
import { eq, and } from "drizzle-orm"

const blogList = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const blog = await getBlogsByID(Number(id))

  if (!blog) {
    notFound()
  }

  const session = await auth()
  const userId = session?.user?.id ? Number(session.user.id) : null
  const isOwnBlog = userId === blog.userID

  let isInReadingList = false
  if (userId && !isOwnBlog) {
    const existingEntry = await db.query.readingList.findFirst({
      where: and(eq(readingList.userId, userId), eq(readingList.blogId, Number(id))),
    })
    isInReadingList = !!existingEntry
  }

  const handleAddToReadingList = addBlogToReadingList.bind(null, Number(id))

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/blogs" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to blogs
      </Link>

      <article className="border border-gray-200 rounded-lg p-6 mt-4">
        <h2 className="text-3xl font-bold mb-4">{blog.title}</h2>

        <div className="mb-6 space-y-2 text-gray-600">
          <p>
            <strong>Author:</strong> {blog.author}
          </p>
          <p>
            <strong>URL:</strong>{" "}
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {blog.url}
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="text-lg font-semibold">
            Likes: <span className="text-blue-600">{blog.likes}</span>
          </span>
          <form action={IncrementLikes}>
            <input type="hidden" name="id" value={blog.id} />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
              👍 Like
            </button>
          </form>
        </div>

        {!isOwnBlog && (
          <form action={handleAddToReadingList}>
            <button
              type="submit"
              disabled={isInReadingList}
              className={`px-4 py-2 rounded transition ${
                isInReadingList
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isInReadingList ? "✓ Added to reading list" : "Add to reading list"}
            </button>
          </form>
        )}
      </article>
    </div>
  )
}

export default blogList