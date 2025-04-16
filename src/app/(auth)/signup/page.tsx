'use client'

import { useState } from 'react'
import { signUpWithEmail } from '@/lib/auth-actions'

export default function SignUpPage() {
  const [message, setMessage] = useState('')

  async function handleSignUp(formData: FormData) {
    const result = await signUpWithEmail(formData)
    setMessage(result.message)
  }

  return (
    <>
      <h1>Sign Up</h1>
      <form action={handleSignUp}>
        <label>Email:</label>
        <input type='email' name='email' required/>
        <label>Password:</label>
        <input type='password' name='password' required/>
        <label>Name:</label>
        <input type='text' name='name' required/>
        <button type='submit'>Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </>
  )
}