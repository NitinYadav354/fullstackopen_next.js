"use client"
import { createBlog, type BlogFormState } from "../../actions/blogs"
import { useActionState } from "react"


const newBlog = () => {
    const initialState: BlogFormState = {
        error: "",
        title: "",
        author: "",
        url: "",
    }

    const [state, formAction] = useActionState<BlogFormState, FormData>(createBlog, initialState)

    return (
        <div>
            <form action={formAction}>
                <label>
                    Title{" "}
                    <input
                        type="text"
                        name="title"
                        defaultValue={state.title}
                    />
                </label>
                <label>
                    Author{" "}
                    <input
                        type="text"
                        name="author"
                        defaultValue={state.author}
                    />
                </label>
                <label>
                    Url{" "}
                    <input
                        type="text"
                        name="url"
                        defaultValue={state.url}
                    />
                </label>
                <button type="submit">Submit</button>
                {state.error && <p style={{ color: "red" }}>{state.error}</p>}
            </form>
        </div>
    )
}

export default newBlog