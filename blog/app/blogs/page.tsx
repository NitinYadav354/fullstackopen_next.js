import { getBlogs } from "../services/blogs";

const Blogs = () => {
    const blogs = getBlogs()
    return(
        <div>
            <h2>Blogs
            </h2>
            <ul>
                {blogs.map(blog => (
                    <li key={blog.id}>
                        <h3>{blog.title}</h3>
                        <p><strong>Author:</strong> {blog.author}</p>
                        <p><strong>URL:</strong> <a href={blog.url}>{blog.url}</a></p>
                        <p><strong>Likes:</strong> {blog.likes}</p>
                        </li> 
                ))}
            </ul>
        </div>
    )
}

export default Blogs