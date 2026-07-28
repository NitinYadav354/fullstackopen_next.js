import { getBlogs,  } from "../services/blogs";

const Blogs = async({searchParams}: {searchParams: Promise<{filter: string}>}) => {
    let {filter = ""} = await searchParams
    filter = filter?.toLowerCase()
    let blogs = [... await getBlogs()]
    blogs.sort((a, b) => b.likes - a.likes);
    blogs = blogs.filter(blog => blog.title.toLowerCase().includes(filter))
    return(
        <div>
            <h2>Blogs
            </h2>
            <form action="" method="get">
                <label >
                    Search Blogs
                    <input type="text" name="filter"/>
                </label>
                
            </form>
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