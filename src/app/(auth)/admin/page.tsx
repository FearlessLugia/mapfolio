'use client'

import { useRouter } from 'next/navigation'
import { signInWithEmail } from '@/lib/auth-actions'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

export default function AdminPage() {
  const router = useRouter()

  async function handleSignIn(formData: FormData) {
    const result = await signInWithEmail(formData)

    if (result.success) {
      toast.success('Sign In Successful', {
        description: 'Redirecting to upload page'
      })
      router.push('/upload')
    } else {
      toast.error('Sign In Failed', {
        description: result.message
      })
    }
  }

  async function handleSignOut() {
    const { data, error } = await authClient.signOut()
    console.log('error', error)

    if (data) {
      toast.success('Sign Out Successful', {
        description: 'Redirecting to home page'
      })
      router.push('/')
    } else {
      toast.error('Sign Out Failed', {
        description: error.message
      })
    }
  }

  return (
    <main className='px-6 max-w-md mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-6'>Sign In</h1>

      <form action={handleSignIn} className='space-y-6'>
        {/* Email */}
        <div>
          <label className='block mb-2 font-medium' htmlFor='email'>
            Email
          </label>
          <input
            className='w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400'
            id='email'
            type='email'
            name='email'
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className='block mb-2 font-medium' htmlFor='password'>
            Password
          </label>
          <input
            className='w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400'
            id='password'
            type='password'
            name='password'
            required
          />
        </div>

        <Button type='submit' className='w-full mt-3'>
          Sign In
        </Button>
      </form>

      <div className='mt-6'>
        <Button variant='outline' className='w-full mb-10' onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <Toaster richColors/>
    </main>
  )
}
