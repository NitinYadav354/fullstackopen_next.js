import { createBlog } from "@/app/actions/blogs"
const newBlog = () => {
    return (
        <div>
            <form action={createBlog}>
                <label>
                    Title
                    <input type="text"  name="title" required/>
                </label>
                <label>
                    Author
                    <input type="text"  name="author" required/>
                </label>
                <label>
                    Url
                    <input type="text"  name="url" required/>
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default newBlog