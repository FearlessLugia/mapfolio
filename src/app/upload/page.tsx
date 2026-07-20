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
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([])
  const [isUploading, setIsUploading] = useState(false)
  
  const MAX_SIZE_MB = 10
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg']

  const updateItem = (index: number, updates: Partial<UploadStatus>) => {
    setUploadStatuses((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...updates }
      return next
    })
  }
  
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
              status: PhotoStatus.Waiting
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
    setIsUploading(true)

    // Only upload items that are Waiting or Error (retry)
    const indicesToUpload = uploadStatuses
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.status === PhotoStatus.Waiting || item.status === PhotoStatus.Error)
      .map(({ index }) => index)

    if (indicesToUpload.length === 0) {
      toast.info('Nothing to upload', {
        description: 'All files have already been uploaded.'
      })
      setIsUploading(false)
      return
    }
    
    await Promise.all(
      indicesToUpload.map((index) => {
        const item = uploadStatuses[index]
        return new Promise<void>((resolve) => {
          const xhr = new XMLHttpRequest()
          const formData = new FormData()
          formData.append('files', item.file)
          
          xhr.open('POST', '/api/upload')
          
          xhr.upload.onprogress = (e) => {
            const percent = Math.round((e.loaded / e.total) * 100)
            updateItem(index, { progress: percent, status: PhotoStatus.Uploading })
          }
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              const res = JSON.parse(xhr.responseText)
              if (res.dbRecords?.length > 0) {
                updateItem(index, {
                  status: PhotoStatus.Uploaded,
                  url: res.dbRecords[0].url
                })
              } else {
                // Server returned 200 but file was in failedFiles
                updateItem(index, { status: PhotoStatus.Error })
              }
            } else {
              updateItem(index, { status: PhotoStatus.Error })
            }
            resolve()
          }
          
          xhr.onerror = () => {
            updateItem(index, { status: PhotoStatus.Error })
            resolve()
          }
          
          xhr.send(formData)
        })
      })
    )

    setIsUploading(false)
    
    // Check final state
    setUploadStatuses((current) => {
      const allSuccess = current.every((item) => item.status === PhotoStatus.Uploaded)
      const hasErrors = current.some((item) => item.status === PhotoStatus.Error)
      
      if (allSuccess) {
        toast.success('Upload Complete', {
          description: 'All files uploaded successfully!'
        })
      } else if (hasErrors) {
        toast.error('Some uploads failed', {
          description: 'Click Upload again to retry failed files.'
        })
      }
      return current
    })
  }

// Programmatically trigger the hidden file input:
  const handleClick = () => {
    // We can directly get the input with getElementById or a ref
    document.getElementById('hidden-file-input')?.click()
  }

  const hasRetryable = uploadStatuses.some(
    (item) => item.status === PhotoStatus.Error || item.status === PhotoStatus.Waiting
  )
  
  return (
    <main className='px-6 h-full'>
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
          <Button type='button' variant='outline' onClick={handleClick} disabled={isUploading}>
            Select Files
          </Button>
          
          <Button type='submit' disabled={isUploading || !hasRetryable}>
            {isUploading
              ? 'Uploading...'
              : uploadStatuses.some((item) => item.status === PhotoStatus.Error)
                ? 'Retry Failed'
                : 'Upload'}
          </Button>
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
                {item.status === PhotoStatus.Waiting && 'Ready to upload'}
                {item.status === PhotoStatus.Uploading && `Uploading... ${item.progress}%`}
                {item.status === PhotoStatus.Uploaded && '✅ Uploaded successfully'}
                {item.status === PhotoStatus.Error && '❌ Upload failed'}
              </p>
            </div>
          ))}
        </div>
      </form>
      
      <Toaster richColors />
    </main>
  )
}