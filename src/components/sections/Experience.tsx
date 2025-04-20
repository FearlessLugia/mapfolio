'use client'

import clsx from 'clsx'
import React from 'react'
import {
  workExp,
  eduExp,
  ExpCardItem,
  ExpCardDirection
} from '@/data/experiences'
import { ExperienceCard } from '@/components/cards/ExperienceCard'
import {
  MONTH_HEIGHT,
  spanInMonths,
  toMonths
} from '@/lib/date'

const sortDesc = (a: ExpCardItem, b: ExpCardItem) =>
  toMonths({ year: b.endYear, month: b.endMonth }) -
  toMonths({ year: a.endYear, month: a.endMonth })

interface Slot {
  start: number
  end: number
}

export const Experience = () => {
  const items = [...workExp, ...eduExp].sort(sortDesc)

  const latest = toMonths({ year: items[0].endYear, month: items[0].endMonth })
  const earliest = items.reduce(
    (min, x) => Math.min(min, toMonths({ year: x.startYear, month: x.startMonth })),
    Number.POSITIVE_INFINITY
  )
  const axisHeight = (latest - earliest) * MONTH_HEIGHT

  const leftSlots: Slot[] = []
  const rightSlots: Slot[] = []

  return (
    <section className='relative mx-auto max-w-5xl'>
      {/* central axis */}
      <div
        className='absolute left-1/2 -translate-x-1/2 bg-border w-px'
        style={{ height: axisHeight }}
        aria-hidden
      />

      {items.map((item) => {
        const isLeft = item.direction === ExpCardDirection.Left
        const resolver = isLeft ? leftSlots : rightSlots
        const itemStart = toMonths({ year: item.startYear, month: item.startMonth })
        const itemEnd = toMonths({ year: item.endYear, month: item.endMonth })

        resolver.push({ start: itemStart, end: itemEnd })

        return (
          <TimelineItem
            key={`${item.place}-${item.startYear}`}
            base={latest}
            item={item}
          />
        )
      })}
    </section>
  )
}

const INDENT = -30

const TimelineItem = ({ item, base }: {
  item: ExpCardItem;
  base: number;
}) => {
  const isLeft = item.direction === ExpCardDirection.Left

  /* vertical geometry */
  const monthsEnd = toMonths({ year: item.endYear, month: item.endMonth })
  const monthsStart = toMonths({ year: item.startYear, month: item.startMonth })
  const wrapperTop = (base - monthsEnd) * MONTH_HEIGHT
  const wrapperH = spanInMonths(
    { year: item.startYear, month: item.startMonth },
    { year: item.endYear, month: item.endMonth }
  ) * MONTH_HEIGHT

  /* horizontal indent in rem */
  const offset = `${INDENT}rem`

  return (
    <div
      className={clsx(
        'absolute flex',
        isLeft ? 'justify-start pr-8' : 'justify-end pl-8'
      )}
      style={{ top: wrapperTop, height: wrapperH, [isLeft ? 'left' : 'right']: 0 }}
    >
      <div
        className='relative flex flex-col items-center'
        style={{
          width: `calc(50% - ${offset})`,
          marginLeft: isLeft ? undefined : offset,
          marginRight: isLeft ? offset : undefined
        }}
      >
        <span className='absolute bg-muted/30 w-px h-full left-1/2 -translate-x-1/2'/>

        {/* END date */}
        <span
          className={clsx('h-px bg-border', isLeft ? 'self-start' : 'self-end')}
          style={{ width: '100%' }}
        />

        <div className='relative h-full w-80 sm:w-96 lg:w-[26rem]'>
          <ExperienceCard experience={item}/>
        </div>

        {/* START date */}
        <span
          className={clsx('h-px bg-border', isLeft ? 'self-start' : 'self-end')}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}
