'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExpCardItem } from '@/data/experiences'

export const ExperienceCard = ({ experience }: { experience: ExpCardItem }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <Card className='hover:shadow-lg transition-shadow'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>{experience.place}</CardTitle>
          <p className='text-sm text-muted-foreground'>{experience.title}</p>
          {experience.location && (
            <p className='text-sm text-muted-foreground'>{experience.location}</p>
          )}
          <p className='text-sm text-muted-foreground'>{experience.date}</p>
        </CardHeader>

        {(experience.tags?.length > 0 || experience.detail) && (
          <CardContent>
            {experience.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-2'>
                {experience.tags.map((tag, i) => (
                  tag && <Badge key={i}>{tag}</Badge>
                ))}
              </div>
            )}

            {experience.detail && (
              <ul className='list-disc list-inside space-y-1'>
                {experience.detail.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}