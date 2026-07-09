
'use client'

import { useEffect } from 'react'

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <main className='flex flex-col items-center justify-center h-full px-6 text-center'>
      <div className='max-w-md'>
        <div className='text-5xl mb-6'>🍂</div>

        <h1 className='text-2xl font-bold mb-3'>
          Something went wrong
        </h1>

        <p className='text-muted-foreground mb-8 leading-relaxed'>
          The server is having trouble loading this page. This usually means the database is
          temporarily unavailable.
        </p>

        <div className='flex flex-col gap-5 items-center'>
          <button
            onClick={reset}
            className='px-6 py-2.5 bg-foreground text-background rounded-md font-medium
                       hover:opacity-90 transition-opacity'
          >
            Try again
          </button>

          <a
            href='/'
            className='text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            ← Back to home
          </a>
        </div>
      </div>
    </main>
  )
}

export default Error
