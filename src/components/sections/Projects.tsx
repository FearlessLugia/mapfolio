'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { projects } from '@/data/projects'

gsap.registerPlugin(ScrollTrigger)

export const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useLayoutEffect(() => {
    const cards = cardsRef.current
    const container = containerRef.current
    if (!cards.length || !container) return

    const cardHeight = cards[0].clientHeight
    container.style.setProperty('--cards-count', `${cards.length}`)
    container.style.setProperty('--card-height', `${cardHeight}px`)
    container.style.visibility = 'visible'

    cards.forEach((card, index) => {
      if (index === cards.length - 1) return
      const offsetTop = 50 + index * 80
      const nextCard = cards[index + 1]
      ScrollTrigger.create({
        trigger: nextCard,
        start: `top+=${offsetTop} bottom`,
        end: `bottom top+=${cardHeight}`,
        scrub: true
      })
    })
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className='cards w-full max-w-[900px] mx-auto grid gap-y-[40px]'
        style={{ visibility: 'hidden' }}
      >
        {projects.map((item, i) => {
          const offsetTop = 50 + i * 80
          return (
            <div
              key={item.title}
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
              className='card sticky top-0'
              style={{ paddingTop: offsetTop }}
            >
              <ProjectCard item={item}/>
            </div>
          )
        })}
      </div>

      <div className='h-[35vh]'/>

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

export default Projects
