"use client"

import { useActionState } from "react"
import { registerUser, type RegisterUserState } from "../actions/users"

export default function RegisterPage() {
  const initialState: RegisterUserState = {
    error: "",
    username: "",
    name: "",
    passwordConfirm: "",
  }

  const [state, formAction] = useActionState(registerUser, initialState)

  return (
    <div>
      <h2>Register</h2>
      <form action={formAction}>
        <div>
          <label htmlFor="username">Username</label>
          <div>
            <input
              id="username"
              type="text"
              name="username"
              defaultValue={state?.username ?? ""}
            />
          </div>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <div>
            <input id="name" type="text" name="name" defaultValue={state?.name ?? ""} />
          </div>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div>
            <input id="password" type="password" name="password" />
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
            />
          </div>
        </div>
        <button type="submit">Register</button>
        {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      </form>
    </div>
  )
}