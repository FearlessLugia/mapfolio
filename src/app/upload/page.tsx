'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { PhotoStatus } from '@prisma/client'

type UploadStatus = {
  file: File
  preview: string
  progress: number
  status: PhotoStatus
  url?: string
}

export default function UploadPage() {
  // const [files, setFiles] = useState<FileList | null>(null)
  // const [previews, setPreviews] = useState<string[]>([])
  // const [urls, setUrls] = useState<string[]>([])
  // const [error, setError] = useState<string | null>(null)
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([])

  const MAX_SIZE_MB = 10
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg']

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
              status: PhotoStatus.Uploading
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
            updatedStatuses[index].status = PhotoStatus.Uploading
            setUploadStatuses([...updatedStatuses])
          }

          xhr.onload = () => {
            if (xhr.status === 200) {
              const res = JSON.parse(xhr.responseText)
              updatedStatuses[index].status = PhotoStatus.Uploaded
              updatedStatuses[index].url = res.dbRecords?.[0]?.url || null
            } else {
              updatedStatuses[index].status = PhotoStatus.Error
            }
            setUploadStatuses([...updatedStatuses])
            resolve()
          }

          xhr.onerror = () => {
            updatedStatuses[index].status = PhotoStatus.Error
            setUploadStatuses([...updatedStatuses])
            resolve()
          }

          xhr.send(formData)
        })
      })
    )

    // Once all uploads are finished, check if all were successful
    const allSuccess = updatedStatuses.every((item) => item.status === PhotoStatus.Uploaded)

    if (allSuccess) {
      toast.success('Upload Complete', {
        description: 'All files uploaded successfully!'
      })
    } else {
      toast.error('Upload Error', {
        description: 'Some files failed to upload. Please try again.'
      })
    }
  }

// Programmatically trigger the hidden file input:
  const handleClick = () => {
    // We can directly get the input with getElementById or a ref
    document.getElementById('hidden-file-input')?.click()
  }

  return (
    <div>
      <main className='px-6'>
        <h1 className='text-2xl font-bold mb-6'>Upload to Mapfolio</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex justify-between'>
            {/* Hidden file input */}
            <input
              id='hidden-file-input'
              type='file'
              multiple
              accept='image/*'
              className='hidden'
              onChange={handleFileChange}
            />
            {/* Button that triggers the hidden file input */}
            <Button type="button" variant='outline' onClick={handleClick}>Select Files</Button>

            <Button type='submit'>Upload</Button>
          </div>

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
                      item.status === PhotoStatus.Uploaded
                        ? 'bg-green-500'
                        : item.status === PhotoStatus.Error
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                <p className='text-sm mt-1'>
                  {item.status === PhotoStatus.Waiting && 'Waiting for upload'}
                  {item.status === PhotoStatus.Uploading && `Uploading... ${item.progress}%`}
                  {item.status === PhotoStatus.Uploaded && '✅ Uploaded successfully'}
                  {item.status === PhotoStatus.Error && '❌ Upload failed'}
                </p>
              </div>
            ))}
          </div>
        </form>

        {/*{error && <p className='text-red-600'>{error}</p>}*/}
      </main>
      <Toaster richColors/>
    </div>)
}