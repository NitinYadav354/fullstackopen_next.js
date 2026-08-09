import Link from "next/link"
import { getBlogs } from "../services/blogs"
import AddToReadingListButton from "../components/AddToReadingListButton"

const Blogs = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter: string }>
}) => {
  let { filter = "" } = await searchParams
  filter = filter?.toLowerCase()
  let blogs = [... await getBlogs()]
  blogs.sort((a, b) => b.likes - a.likes)
  blogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(filter)
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Blogs</h2>

      <form method="get" className="mb-6">
        <label className="block mb-3">
          <span className="text-gray-700 font-medium">Search Blogs</span>
          <input
            type="text"
            name="filter"
            placeholder="Search by title..."
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </form>

      <ul className="space-y-4">
        {blogs.map((blog) => (
          <li
            key={blog.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <Link href={`/blogs/${blog.id}`}>
              <h3 className="text-xl font-bold text-blue-600 hover:underline">
                {blog.title}
              </h3>
            </Link>
            <p className="text-gray-600 mt-1">
              <strong>Author:</strong> {blog.author}
            </p>
            <p className="text-gray-600">
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
            <p className="text-gray-600 mt-2">
              <strong>Likes:</strong>{" "}
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {blog.likes}
              </span>
            </p>
            <AddToReadingListButton blogId={blog.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs
