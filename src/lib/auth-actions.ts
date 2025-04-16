'use server'

import { auth } from '@/lib/auth'

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const callbackURL = '/upload'

  const res = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name
    }
  })
  console.log('Sign-up response:', res)

  if (!res) {
    return {
      success: false,
      message: `Error: ${res || 'An unexpected error occurred'}`,
      callbackURL: ''
    }
  }

  return {
    success: true,
    message: 'Sign-up successful!',
    callbackURL
  }
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const callbackURL = '/upload'

  const res = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  })
  console.log('Sign-in response:', res)

  if (!res) {
    return {
      success: false,
      message: `Error: ${res || 'An unexpected error occurred'}`,
      callbackURL: ''
    }
  }

  return {
    success: true,
    message: 'Sign-in successful!',
    callbackURL
  }
}
