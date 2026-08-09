"use client"
import { createBlog, type BlogFormState } from "../../actions/blogs"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useNotification } from "../../components/NotificationContext"


const newBlog = () => {
    const initialState: BlogFormState = {
        error: "",
        title: "",
        author: "",
        url: "",
        success: false,
    }

    const [state, formAction] = useActionState<BlogFormState, FormData>(createBlog, initialState)
    const { showNotification } = useNotification()
    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            showNotification("Blog created successfully!")
            router.push("/blogs")
        }
    }, [state, showNotification, router])

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">Create a New Blog</h2>
            <form action={formAction} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        defaultValue={state.title}
                        placeholder="Enter blog title"
                        data-testid="title-input"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Author
                    </label>
                    <input
                        type="text"
                        name="author"
                        defaultValue={state.author}
                        placeholder="Enter author name"
                        data-testid="author-input"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        URL
                    </label>
                    <input
                        type="text"
                        name="url"
                        defaultValue={state.url}
                        placeholder="Enter blog URL"
                        data-testid="url-input"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    data-testid="create-blog-button"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                >
                    Create Blog
                </button>

                {state.error && (
                    <p className="text-red-600 font-medium bg-red-100 p-3 rounded">
                        {state.error}
                    </p>
                )}
            </form>
        </div>
    )
}

export default newBlog