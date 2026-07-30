import { notFound } from "next/navigation";
import Link from "next/link";
import { getUsersWithBlogs } from "@/app/services/users";

const userPage = async({params} : {params: Promise<{username : string}>}) => {
    const { username } = await params
    const decodedUsername = decodeURIComponent(username);
    const user = await getUsersWithBlogs(decodedUsername)
    if (!user){
        notFound()
    }
    return (
        <div>
            <h2>{user.name}</h2>
            <p>username: {user.username}</p>
            <h3>Blogs</h3>
            <ul>
                {user.blogs.map((blog) => (
                    <li key={blog.id}>
                        <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                        <p>{blog.author}</p>
                        <p>{blog.url}</p>
                        <p>{blog.likes}</p>

                    </li>
                ))}
            </ul>
        </div>
    )
} 

export default userPage