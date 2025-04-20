'use client'
import React, { forwardRef } from 'react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import clsx from 'clsx'
import { ExpCardItem } from '@/data/experiences'
import { ExperienceCard } from '@/components/cards/ExperienceCard'

interface Props {
  experience: ExpCardItem
  spanPx: number
  compact: boolean
}

export const ExperienceCardWithDialog = forwardRef<HTMLDivElement, Props>(
  ({ experience, spanPx, compact }, ref) => {
    const shellCls = 'flex flex-col w-full h-full experience-card h-full w-80 sm:w-96 lg:w-[26rem] rounded-xl border bg-background hover:shadow-lg'

    return compact ? (
      <Dialog>
        <DialogTrigger asChild>
          <Card ref={ref} style={{ height: spanPx }}
                className={clsx(shellCls, 'cursor-pointer overflow-hidden')}>
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
      <Card ref={ref} className={shellCls}>
        <ExperienceCard experience={experience}/>
      </Card>
    )
  }
)
ExperienceCardWithDialog.displayName = 'ExperienceCardWithDialog'
