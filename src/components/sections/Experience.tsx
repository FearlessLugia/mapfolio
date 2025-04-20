'use client'

import clsx from 'clsx'
import { workExp, eduExp, lifeExp, ExpCardItem, ExpCardDirection } from '@/data/experiences'
import { MONTH_HEIGHT, spanInMonths, toMonths } from '@/lib/date'
import { ExperienceCardWithDialog } from '@/components/cards/ExperienceCardWithDialog'

const sortDesc = (a: ExpCardItem, b: ExpCardItem) =>
  toMonths({ year: b.endYear, month: b.endMonth }) -
  toMonths({ year: a.endYear, month: a.endMonth })

export const Experience = () => {
  const items = [...workExp, ...eduExp, ...lifeExp].sort(sortDesc)
  const latest = toMonths({ year: items[0].endYear, month: items[0].endMonth })
  const earliest = items.reduce(
    (min, x) => Math.min(min, toMonths({ year: x.startYear, month: x.startMonth })),
    Number.POSITIVE_INFINITY
  )
  const axisHeight = (latest - earliest) * MONTH_HEIGHT

  return (
    <section className='relative mx-auto max-w-5xl'>
      {/* central axis */}
      <div
        className='absolute left-1/2 -translate-x-1/2 bg-border w-px'
        style={{ height: axisHeight }}
      />

      {items.map((item) => {
        const isLeft = item.direction === ExpCardDirection.Left
        const endM = toMonths({ year: item.endYear, month: item.endMonth })
        const topPx = (latest - endM) * MONTH_HEIGHT
        const spanPx =
          spanInMonths(
            { year: item.startYear, month: item.startMonth },
            { year: item.endYear, month: item.endMonth }
          ) * MONTH_HEIGHT

        return (
          <div
            key={`${item.place}-${item.startYear}`}
            className={clsx('absolute flex', isLeft ? 'justify-start pr-4' : 'justify-end pl-4')}
            style={{ top: topPx, height: spanPx, [isLeft ? 'left' : 'right']: 0 }}
          >
            <div
              className='relative flex flex-col items-center w-[calc(50%+48rem)]'
            >
              <ExperienceCardWithDialog
                experience={item}
                className='experience-card h-full w-80 sm:w-96 lg:w-[26rem] rounded-xl border bg-background'
              />
            </div>
          </div>
        )
      })}
    </section>
  )
}
