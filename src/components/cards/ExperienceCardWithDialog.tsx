'use client'
import React, { forwardRef } from 'react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import clsx from 'clsx'
import { ExpCardItem } from '@/data/experiences'
import { ExperienceCard } from './ExperienceCard'
import { MONTH_HEIGHT } from '@/lib/date'

interface Props {
  experience: ExpCardItem;
  className?: string;
  minHeight?: number
}

export const ExperienceCardWithDialog = forwardRef<HTMLDivElement, Props>(
  ({ experience, className, minHeight = 120 }, ref) => {
    const months = (experience.endYear * 12 + (experience.endMonth ?? 1)) - (experience.startYear * 12 + (experience.startMonth ?? 1))
    const spanPx = months * MONTH_HEIGHT
    const compact = (spanPx - MONTH_HEIGHT) < minHeight
    const shellCls = clsx('flex flex-col w-full h-full', className)

    return compact ? (
      <Dialog>
        <DialogTrigger asChild>
          <Card ref={ref} style={{ height: spanPx }}
                className={clsx(shellCls, 'cursor-pointer overflow-hidden hover:shadow-lg')}>
            <ExperienceCard experience={experience}/>
          </Card>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogTitle className='sr-only'>Detailed experience information</DialogTitle>
          <Card className='shadow-none border-none'>
            <ExperienceCard experience={experience}/>
          </Card>
        </DialogContent>
      </Dialog>
    ) : (
      <Card ref={ref} className={clsx(shellCls, 'hover:shadow-lg')}>
        <ExperienceCard experience={experience}/>
      </Card>
    )
  }
)
ExperienceCardWithDialog.displayName = 'ExperienceCardWithDialog'
