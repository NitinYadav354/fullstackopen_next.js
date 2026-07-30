"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState("")
    const handleSubmit = async( e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const result = await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirect: false,

        })

        if (result?.error){
            setError("Invalid username or password")
        }
        else{
            router.push("/")
            router.refresh()
        }
        
    }
    return(
        <div>      
            <h2>Login</h2>  
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
          <label>
            Username
            <input type="text" name="username" required />
          </label>
        </div>
        <div>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
        </div>
        <button type="submit">submit</button>
            </form>

        </div>

    )
}