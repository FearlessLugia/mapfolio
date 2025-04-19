import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import React from 'react'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  link?: string
}

export const ProjectCard = ({ item }: { item: ProjectCardProps }) => {
  return (
    <Card className='card-inner will-change-transform origin-top'>
      <CardHeader>
        <CardTitle className='text-4xl md:text-5xl text-[#16263a]'>
          {item.title}
        </CardTitle>
        <CardDescription className='mt-4 text-lg md:text-xl text-[#16263a]'>
          {item.description}
        </CardDescription>
      </CardHeader>

      <CardContent className='pt-4 min-h-[28px]'>
        <div className='flex flex-col gap-4 pt-2'>
          {item.tags?.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {item.tags.map((tag) => (
                <Badge key={tag} variant='secondary'>
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div>
            {item.link ? (
              <Link
                href={item.link}
                target='_blank'
                className='underline text-sky-600 hover:text-sky-800'
              >
                View GitHub Repository ↗
              </Link>
            ) : (
              <span>This project is proprietary to the company — no public link available 😥</span>
            )}
          </div>
        </div>
      </CardContent>

    </Card>
  )
}
