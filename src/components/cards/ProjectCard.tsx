import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import React from 'react'
import { ProjectCardItem } from '@/data/projects'

export const ProjectCard = ({ item }: { item: ProjectCardItem }) => {
  return (
    <Card className='card-inner will-change-transform origin-top shadow-lg rounded-3xl'>
      <CardHeader>
        <CardTitle className='text-3xl md:text-4xl font-bold text-[#16263a]'>
          {item.title}
        </CardTitle>
        <CardDescription className='mt-4 text-lg md:text-xl text-muted-foreground mb-6'>
          {item.description}
        </CardDescription>
      </CardHeader>

      <CardContent className='min-h-[28px]'>
        <div className='flex flex-col gap-4'>
          {item.tags?.length > 0 && (
            <div className='flex flex-wrap gap-3'>
              {item.tags.map((tag) => (
                <Badge key={tag} variant='secondary'>
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className='text-lg text-[#16263a]'>
            <ul className='list-disc pl-5'>
              {item.detail?.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>

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
              <span className='text-md'>This project is proprietary to the company — no public link available 😥</span>
            )}
          </div>
        </div>
      </CardContent>

    </Card>
  )
}
