'use client'

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  return (
    <html lang='en'>
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#fafafa',
        color: '#171717',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '0 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>🍂</div>

          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
            Something went wrong
          </h1>

          <p style={{ color: '#737373', lineHeight: 1.6, marginBottom: '32px' }}>
            The server is having trouble right now. This usually resolves itself quickly.
          </p>

          <button
            onClick={reset}
            style={{
              padding: '10px 24px',
              backgroundColor: '#171717',
              color: '#fafafa',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

export default GlobalError
