import { getBlogsByID } from "@/app/services/blogs"
import { notFound } from "next/navigation"
const blogList = async({params} : {params : Promise<{id : string}>}) => {
    const {id} = await params
    const blog = getBlogsByID(Number(id))
    console.log(blog)

    if (!blog) {
        notFound()
    }

    return(
        <div>
            <h2>{blog.title}</h2>
            <p>{blog.author}</p>
            <p>{blog.url}</p>
            <p>{blog.likes}</p>
        </div>
    )


}

export default blogList