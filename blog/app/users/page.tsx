import { getUsers } from "../services/users"
import Link from "next/link"

const users = async() => {
    const users = await getUsers()
    return (
        <div>
            <ul>
                {users.map(user => 
                (<li key={user.id}>
                    <Link href={`/users/${user.username}`}>{user.name}</Link>
                </li>))}
            </ul>
        </div>
    )
}

export default users