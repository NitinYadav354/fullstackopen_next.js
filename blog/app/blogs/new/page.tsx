"use client"
import { createBlog } from "@/app/actions/blogs"
import { useActionState } from "react"
const newBlog = () => {
    const [state, formAction] = useActionState(createBlog, {error: ""})
    return (
        <div>
            <form action={formAction}>
                <label>
                    Title
                    <input type="text"  name="title" />
                </label>
                <label>
                    Author
                    <input type="text"  name="author" />
                </label>
                <label>
                    Url
                    <input type="text"  name="url" />
                </label>
                <button type="submit">Submit</button>
                {state.error && <p style={{ color: "red" }}>{state.error}</p>}
            </form>
        </div>
    )
}

export default newBlog