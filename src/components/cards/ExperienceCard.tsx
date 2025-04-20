'use client'
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExpCardItem } from '@/data/experiences'

type Props = { experience: ExpCardItem; showDetail?: boolean };
export const ExperienceCard = ({ experience }: Props) => (
  <div className='flex flex-col gap-2'>
    <CardHeader>
      <CardTitle className='text-xl font-semibold'>{experience.place}</CardTitle>
      <p className='text-sm text-muted-foreground'>{experience.title}</p>
      {experience.location && <p className='text-sm text-muted-foreground'>{experience.location}</p>}
      <p className='text-sm text-muted-foreground'>{experience.date}</p>
    </CardHeader>

    {(experience.tags?.length || experience.detail) && (
      <CardContent className='space-y-2 flex-grow'>
        {!!experience.tags?.length && (
          <div className='flex flex-wrap gap-2'>
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
  </div>
)
