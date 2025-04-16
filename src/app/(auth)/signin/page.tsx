'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmail } from '@/lib/auth-actions'

export default function SignInPage() {
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleSignIn(formData: FormData) {
    const result = await signInWithEmail(formData)
    setMessage(result.message)

    if (result.success) {
      setTimeout(() => router.push('/upload'), 3000)
    }
  }

  return (
    <>
      <h1>Sign In</h1>
      <form action={handleSignIn}>
        <label>Email:</label>
        <input type='email' name='email' required/>
        <label>Password:</label>
        <input type='password' name='password' required/>
        <button type='submit'>Sign In</button>
      </form>
      {message && <p>{message}</p>}
    </>
  )
}