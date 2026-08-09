import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users, readingList } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generateToken } from "../actions/users"
import { markAsRead } from "../actions/blogs"
import Link from "next/link"

const MePage = async () => {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const userId = session.user.id
  if (!userId) {
    redirect("/login")
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(userId)),
  })

  if (!user) {
    redirect("/login")
  }

  const userReadingList = await db.query.readingList.findMany({
    where: eq(readingList.userId, Number(userId)),
    with: {
      blog: true,
    },
    orderBy: (entries, { desc }) => [desc(entries.id)],
  })

  const unreadBlogs = userReadingList.filter((entry) => !entry.read)
  const readBlogs = userReadingList.filter((entry) => entry.read)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <p className="bg-gray-100 px-4 py-2 rounded text-gray-800">
              {user.name}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <p className="bg-gray-100 px-4 py-2 rounded text-gray-800">
              {user.username}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">API Token</h3>

        {user.token ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Your API Token
              </label>
              <div className="bg-gray-100 px-4 py-2 rounded break-all font-mono text-sm">
                {user.token}
              </div>
            </div>

            <form action={generateToken}>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Generate New Token
              </button>
            </form>

            <p className="text-sm text-gray-600">
              Generating a new token will replace your current token.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              You have not generated an API token yet.
            </p>

            <form action={generateToken}>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Generate Token
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Reading List</h3>

        {userReadingList.length === 0 ? (
          <p className="text-gray-600">
            Your reading list is empty.{" "}
            <Link href="/blogs" className="text-blue-600 hover:underline">
              Add some blogs
            </Link>
          </p>
        ) : (
          <div className="space-y-6">
            {/* Unread Section */}
            {unreadBlogs.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Unread ({unreadBlogs.length})
                </h4>
                <ul className="space-y-3">
                  {unreadBlogs.map((entry) => (
                    <li
                      key={entry.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <Link
                          href={`/blogs/${entry.blog.id}`}
                          className="text-blue-600 hover:underline font-semibold flex-1"
                        >
                          {entry.blog.title}
                        </Link>
                        <form action={markAsRead.bind(null, entry.id)}>
                          <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap transition"
                          >
                            Mark as read
                          </button>
                        </form>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Author:</strong> {entry.blog.author}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>URL:</strong>{" "}
                        <a
                          href={entry.blog.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {entry.blog.url}
                        </a>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Read Section */}
            {readBlogs.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Read ({readBlogs.length})
                </h4>
                <ul className="space-y-3">
                  {readBlogs.map((entry) => (
                    <li
                      key={entry.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition bg-green-50"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <Link
                          href={`/blogs/${entry.blog.id}`}
                          className="text-blue-600 hover:underline font-semibold flex-1"
                        >
                          {entry.blog.title}
                        </Link>
                        <span className="text-green-600 font-medium text-sm whitespace-nowrap">
                          ✓ Read
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Author:</strong> {entry.blog.author}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>URL:</strong>{" "}
                        <a
                          href={entry.blog.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {entry.blog.url}
                        </a>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MePage
