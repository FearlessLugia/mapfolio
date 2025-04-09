'use client'

import { useState } from 'react'

export default function UploadPage() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [urls, setUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files || files.length === 0) {
      setError('Please select a file')
      return
    }

    const formData = new FormData()
    Array.from(files).forEach((file) => {
      formData.append('files', file)
    })

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        throw new Error('Upload failed')
      }

      const data = await res.json()
      setUrls(data.urls)
      setError(null)
    } catch (err) {
      setError('Failed to upload file')
      console.error(err)
    }
  }

  return (
    <>
      <h1 className='text-5xl font-bold mb-8'>Upload to DigitalOcean Spaces</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='file'
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className='file:p-2 file:rounded file:border-0 file:bg-gray-200'
        />
        <button
          type='submit'
          className='p-2 bg-gray-800 text-white rounded hover:bg-gray-500'
        >
          Upload
        </button>
      </form>
      {error && <p className='text-red-600'>{error}</p>}
      {urls.length > 0 && (
        <div>
          <p>Uploaded files: </p>
          <ul className='mt-4 space-y-2'>
            {urls.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}