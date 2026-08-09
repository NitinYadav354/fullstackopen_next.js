import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generateToken } from "../actions/users"

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

  return (
    <div className="max-w-2xl mx-auto p-6">
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

      <div className="bg-white border border-gray-200 rounded-lg p-6">
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
    </div>
  )
}

export default MePage
