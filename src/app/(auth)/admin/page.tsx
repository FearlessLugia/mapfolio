'use client'

import { useRouter } from 'next/navigation'
import { signInWithEmail } from '@/lib/auth-actions'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { Session } from 'better-auth'

export default function AdminPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await authClient.getSession()
      console.log('data', data, 'error', error)

      if (data) {
        setSession(data.session)
      }
      if (error) {
        toast.error('Session Error', {
          description: error.message
        })
      }
    }

    checkSession()
  }, [])

  async function handleSignIn(formData: FormData) {
    try {
      const result = await signInWithEmail(formData)

      if (result.success) {
        toast.success('Sign In Successful', {
          description: 'Redirecting to upload page'
        })

        setTimeout(() => {
          router.push(result.callbackURL)
          // Force refresh the navbar
          router.refresh()
        }, 1000)
      } else {
        toast.error('Sign In Failed', {
          description: result.message
        })
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error('Sign In Failed', {
          description: err.message
        })
      } else {
        toast.error('Sign In Failed', {
          description: 'Unknown error'
        })
      }
    }
  }

  async function handleSignOut() {
    const { data, error } = await authClient.signOut()

    if (data) {
      toast.success('Sign Out Successful', {
        description: 'Redirecting to home page'
      })

      setTimeout(() => {
        router.push('/')
        // Force refresh the navbar
        router.refresh()
      }, 1000)
    } else {
      toast.error('Sign Out Failed', {
        description: error.message
      })
    }
  }

  return (
    <main className='px-6 max-w-md mx-auto mt-10 h-full w-full'>
      <h1 className='text-2xl font-bold mb-6'>Admin</h1>

      {!session ? (
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
      ) : (
        <div className='mt-6 space-y-4'>
          <Button variant='outline' className='w-full' onClick={handleSignOut}>
            Sign Out
          </Button>

          <hr className='my-4' />
          <h2 className='text-lg font-semibold'>Cleanup</h2>

          <Button
            variant='outline'
            className='w-full'
            onClick={async () => {
              const res = await fetch('/api/cleanup/db', { method: 'POST' })
              const data = await res.json()
              if (res.ok) {
                toast.success('DB Cleanup Complete', {
                  description: `Deleted ${data.deleted} zombie record(s).${data.errors.length > 0 ? ` ${data.errors.length} error(s).` : ''}`
                })
              } else {
                toast.error('DB Cleanup Failed', { description: data.error })
              }
            }}
          >
            🗃️ Clean DB Zombies
          </Button>

          <Button
            variant='outline'
            className='w-full'
            onClick={async () => {
              const res = await fetch('/api/cleanup/r2', { method: 'POST' })
              const data = await res.json()
              if (res.ok) {
                toast.success('R2 Cleanup Complete', {
                  description: `Deleted ${data.deleted} orphan file(s).${data.errors.length > 0 ? ` ${data.errors.length} error(s).` : ''}`
                })
              } else {
                toast.error('R2 Cleanup Failed', { description: data.error })
              }
            }}
          >
            ☁️ Clean R2 Orphans
          </Button>
        </div>
      )}

      <Toaster richColors/>
    </main>
  )
}
