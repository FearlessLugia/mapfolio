'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExpCardItem } from '@/data/experiences'

export const ExperienceCard = ({ experience }: { experience: ExpCardItem }) => (
  <Card className='hover:shadow-lg transition-shadow w-full h-full flex flex-col'>
    <CardHeader>
      <CardTitle className='text-xl font-semibold'>{experience.place}</CardTitle>
      <p className='text-sm text-muted-foreground'>{experience.title}</p>
      {experience.location && (
        <p className='text-sm text-muted-foreground'>{experience.location}</p>
      )}
      <p className='text-sm text-muted-foreground'>{experience.date}</p>
    </CardHeader>

    {(experience.tags?.length || experience.detail) && (
      <CardContent className='pt-2'>
        {!!experience.tags?.length && (
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
)
