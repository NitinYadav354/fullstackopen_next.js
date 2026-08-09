"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { registerUser, type RegisterUserState } from "../actions/users"

export default function RegisterPage() {
  const initialState: RegisterUserState = {
    error: "",
    username: "",
    name: "",
    passwordConfirm: "",
  }

  const [state, formAction] = useActionState(registerUser, initialState)
  const router = useRouter()
  const passwordRef = useRef("")

  useEffect(() => {
    if (!state?.success) return

    void signIn("credentials", {
      username: state.username,
      password: passwordRef.current,
      redirect: false,
    }).then((result) => {
      if (result?.ok) router.push("/")
    })
  }, [router, state])

  return (
    <div>
      <h2>Register</h2>
      <form
        action={formAction}
        onSubmit={(event) => {
          passwordRef.current = new FormData(event.currentTarget).get("password") as string
        }}
      >
        <div>
          <label htmlFor="username">Username</label>
          <div>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              defaultValue={state?.username ?? ""}
              data-testid="username-input"
            />
          </div>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <div>
            <input id="name" type="text" name="name" placeholder="Name" defaultValue={state?.name ?? ""} data-testid="name-input" />
          </div>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div>
            <input id="password" type="password" name="password" placeholder="Password" data-testid="password-input" />
          </div>
        </div>
        <div>
          <label htmlFor="passwordConfirm">Password confirm</label>
          <div>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              defaultValue={state?.passwordConfirm ?? ""}
              data-testid="password-confirm-input"
            />
          </div>
        </div>
        <button type="submit" data-testid="register-button">Register</button>
        {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      </form>
    </div>
  )
}
