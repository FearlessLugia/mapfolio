'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CardItem {
  title: string
  description: string
}

const items: CardItem[] = [
  {
    title: 'Card Title',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab dicta error nam eaque. Eum fuga laborum quos expedita iste saepe similique, unde possimus quia at magnam sed cupiditate? Reprehenderit, harum!'
  },
  {
    title: 'Card Title',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab dicta error nam eaque. Eum fuga laborum quos expedita iste saepe similique, unde possimus quia at magnam sed cupiditate? Reprehenderit, harum!'
  },
  {
    title: 'Card Title',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab dicta error nam eaque. Eum fuga laborum quos expedita iste saepe similique, unde possimus quia at magnam sed cupiditate? Reprehenderit, harum!'
  }
]

export const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const cards = cardsRef.current
    const container = containerRef.current
    if (!cards.length || !container) return

    const cardHeight = cards[0].clientHeight
    container.style.setProperty('--cards-count', cards.length.toString())
    container.style.setProperty('--card-height', `${cardHeight}px`)

    cards.forEach((card, index) => {
      const offsetTop = 20 + index * 100
      console.log('offsetTop', offsetTop)
      card.style.paddingTop = `${offsetTop}px`

      if (index === cards.length - 1) return

      const toScale = 1 - (cards.length - 1 - index) * 0.1
      const nextCard = cards[index + 1]
      const inner = card.querySelector<HTMLDivElement>('.card-inner')
      if (!inner) return

      ScrollTrigger.create({
        trigger: nextCard,
        start: `top+=${offsetTop} bottom`,
        end: `bottom top+=${card.clientHeight}`,
        scrub: true
        // onUpdate: (self) => {
        //   const p = self.progress
        //   gsap.to(inner, { scale: 1 + (toScale - 1) * p, overwrite: true })
        // }
      })
    })
  }, [])

  return (
    <>
      <div className='h-[40vh]'></div>
      <div
        ref={containerRef}
        className='cards w-full max-w-[900px] mx-auto grid gap-y-[40px]'
      >
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) cardsRef.current[i] = el
            }}
            className='card sticky top-0'
          >
            <div className='card-inner will-change-transform bg-white rounded-lg overflow-hidden shadow-lg origin-top'>
              <div className='px-8 py-10 flex flex-col'>
                <h1 className='text-5xl font-semibold text-[#16263a] leading-tight'>
                  {item.title}
                </h1>
                <p className='mt-4 text-xl leading-relaxed text-[#16263a]'>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='h-[90vh]'></div>
      <style jsx>{`
        .cards {
          --cards-count: 0;
          --card-height: 0px;
          grid-template-rows: repeat(var(--cards-count), var(--card-height));
        }
      `}</style>
    </>
  )
}
