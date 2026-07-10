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
  hideDetail?: boolean
}

export const ExperienceCardWithDialog = forwardRef<HTMLDivElement, Props>(
  ({ experience, spanPx, compact, hideDetail }, ref) => {
    const baseCls = 'flex flex-col h-full rounded-xl border bg-background hover:shadow-lg w-[calc(100vw-5rem)] md:w-80 lg:w-[26rem]'
    const shiftCls = experience.isLarge ? 'md:translate-x-4' : ''
    const common = clsx(baseCls, shiftCls, { 'cursor-pointer overflow-hidden': compact })
    const cardStyle = spanPx > 0 ? { height: spanPx } : undefined

    return compact ? (
      <Dialog>
        <DialogTrigger asChild>
          <Card ref={ref} style={cardStyle}
                className={common} suppressHydrationWarning>
            <ExperienceCard experience={experience} showDetail={!hideDetail} />
          </Card>
        </DialogTrigger>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogTitle className='sr-only'>Detailed experience information</DialogTitle>
          <Card className='shadow-none border-none'>
            <ExperienceCard experience={experience} showDetail={true} />
          </Card>
        </DialogContent>
      </Dialog>
    ) : (
      <Card ref={ref} className={common}>
        <ExperienceCard experience={experience} showDetail={!hideDetail} />
      </Card>
    )
  }
)

ExperienceCardWithDialog.displayName = 'ExperienceCardWithDialog'
