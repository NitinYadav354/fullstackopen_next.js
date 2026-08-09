import Link from "next/link"
import { getBlogsByID } from "@/app/services/blogs"
import { IncrementLikes } from "@/app/actions/blogs"
import { notFound } from "next/navigation"

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

        <div className="flex items-center gap-4">
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
      </article>
    </div>
  )
}

export default blogList