'use client'

import { forwardRef } from 'react'
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
    const baseCls = 'flex flex-col h-full rounded-xl border bg-background hover:shadow-lg w-80 sm:w-96 lg:w-[26rem]'
    const shiftCls = experience.isLarge ? 'translate-x-4' : ''
    const common = clsx(baseCls, shiftCls, { 'cursor-pointer overflow-hidden': compact })

    return compact ? (
      <Dialog>
        <DialogTrigger asChild>
          <Card ref={ref} style={{ height: spanPx }}
                className={common}>
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
      <Card ref={ref} className={common}>
        <ExperienceCard experience={experience}/>
      </Card>
    )
  }
)

ExperienceCardWithDialog.displayName = 'ExperienceCardWithDialog'
