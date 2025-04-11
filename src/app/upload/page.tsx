'use client'

import { useState } from 'react'
import Image from 'next/image'

type UploadStatus = {
  file: File
  preview: string
  progress: number
  status: 'waiting' | 'uploading' | 'success' | 'error'
  url?: string
}

export default function UploadPage() {
  // const [files, setFiles] = useState<FileList | null>(null)
  // const [previews, setPreviews] = useState<string[]>([])
  // const [urls, setUrls] = useState<string[]>([])
  // const [error, setError] = useState<string | null>(null)
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([])

  const MAX_SIZE_MB = 10
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    const validFiles: File[] = []

    for (const file of Array.from(selectedFiles)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`${file.name} is not a supported image type.`)
        continue
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`${file.name} exceeds the 10MB size limit.`)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    const readers = validFiles.map(
      (file) =>
        new Promise<UploadStatus>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve({
              file,
              preview: reader.result as string,
              progress: 0,
              status: 'uploading'
            })
          }
          reader.readAsDataURL(file)
        })
    )

    const results = await Promise.all(readers)
    setUploadStatuses(results)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updatedStatuses = [...uploadStatuses]

    await Promise.all(
      updatedStatuses.map((item, index) => {
        return new Promise<void>((resolve) => {
          const xhr = new XMLHttpRequest()
          const formData = new FormData()
          formData.append('files', item.file)

          xhr.open('POST', '/api/upload')

          xhr.upload.onprogress = (e) => {
            const percent = Math.round((e.loaded / e.total) * 100)
            updatedStatuses[index].progress = percent
            updatedStatuses[index].status = 'uploading'
            setUploadStatuses([...updatedStatuses])
          }

          xhr.onload = () => {
            if (xhr.status === 200) {
              const res = JSON.parse(xhr.responseText)
              updatedStatuses[index].status = 'success'
              updatedStatuses[index].url = res.dbRecords?.[0]?.s3Url || null
            } else {
              updatedStatuses[index].status = 'error'
            }
            setUploadStatuses([...updatedStatuses])
            resolve()
          }

          xhr.onerror = () => {
            updatedStatuses[index].status = 'error'
            setUploadStatuses([...updatedStatuses])
            resolve()
          }

          xhr.send(formData)
        })
      })
    )
  }


  return (
    <>
      <h1 className='text-5xl font-bold mb-8'>Upload to Mapfolio</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='file'
          multiple
          onChange={handleFileChange}
          accept='image/*'
          className='file:p-2 file:rounded file:border-0 file:bg-gray-200'
        />

        {/* thumbnail preview */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
          {uploadStatuses.map((item, index) => (
            <div key={index} className='relative w-full aspect-[4/3] rounded overflow-hidden shadow'>
              <Image
                src={item.preview}
                alt={`preview-${index}`}
                fill
                unoptimized
                className='object-cover'
              />

              <div className='absolute bottom-0 left-0 right-0 h-2 bg-white/50'>
                <div
                  className={`h-full transition-all ${
                    item.status === 'success'
                      ? 'bg-green-500'
                      : item.status === 'error'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              <p className='text-sm mt-1'>
                {item.status === 'waiting' && 'Waiting for upload'}
                {item.status === 'uploading' && `Uploading... ${item.progress}%`}
                {item.status === 'success' && '✅ Uploaded successfully'}
                {item.status === 'error' && '❌ Upload failed'}
              </p>
            </div>
          ))}
        </div>

        <button
          type='submit'
          className='p-2 bg-gray-800 text-white rounded hover:bg-gray-500'
        >
          Upload
        </button>
      </form>

      {/*{error && <p className='text-red-600'>{error}</p>}*/}
    </>
  )
}