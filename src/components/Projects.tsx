'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

interface CardItem {
  title: string
  description: string
  tags: string[]
  link?: string
}

const items: CardItem[] = [
  {
    title: 'Sample Project',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    tags: ['Demo']
  },
  {
    title: 'Arc‑sync',
    description: 'Light‑weight, lock‑free concurrency primitives for async Rust.',
    tags: ['Rust', 'Concurrency']
  },
  {
    title: 'Lesty‑kv',
    description: 'An LSM‑Tree–based key‑value store engine implemented in C++',
    tags: ['C++', 'Database', 'Key‑Value Store'],
    link: 'https://github.com/FearlessLugia/lesty-kv'
  },
  {
    title: 'Rusty‑dfs',
    description: 'A distributed file storage system implemented in Rust',
    tags: ['Rust', 'Distributed System', 'File Storage'],
    link: 'https://github.com/FearlessLugia/rusty-dfs'
  }
]

export const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  // GSAP scroll trigger logic
  useEffect(() => {
    const cards = cardsRef.current
    const container = containerRef.current
    if (!cards.length || !container) return

    const cardHeight = cards[0].clientHeight
    container.style.setProperty('--cards-count', cards.length.toString())
    container.style.setProperty('--card-height', `${cardHeight}px`)

    cards.forEach((card, index) => {
      const offsetTop = 50 + index * 100 // spacing between cards
      card.style.paddingTop = `${offsetTop}px`

      if (index === cards.length - 1) return

      // scale targets for the outgoing cards
      const nextCard = cards[index + 1]
      const inner = card.querySelector<HTMLDivElement>('.card-inner')
      if (!inner) return

      ScrollTrigger.create({
        trigger: nextCard,
        start: `top+=${offsetTop} bottom`,
        end: `bottom top+=${card.clientHeight}`,
        scrub: true
      })
    })
  }, [])

  return (
    <>
      <div className='h-[40vh]'/>
      <div
        ref={containerRef}
        className='cards w-full max-w-[900px] mx-auto grid gap-y-[40px]'
      >
        {items.map((item, i) => (
          <div
            key={item.title}
            ref={(el) => {
              if (el) cardsRef.current[i] = el
            }}
            className='card sticky top-0'
          >
            <Card className='card-inner will-change-transform origin-top'>
              <CardHeader>
                <CardTitle className='text-4xl md:text-5xl text-[#16263a]'>
                  {item.title}
                </CardTitle>
                <CardDescription className='mt-4 text-lg md:text-xl text-[#16263a]'>
                  {item.description}
                </CardDescription>
              </CardHeader>

              {item.tags?.length > 0 && (
                <CardContent className='flex flex-wrap gap-2 pt-2'>
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </CardContent>
              )}

              {item.link ? (
                <CardContent className='pt-4'>
                  <Link
                    href={item.link}
                    target='_blank'
                    className='underline text-sky-600 hover:text-sky-800'
                  >
                    View GitHub Repository ↗
                  </Link>
                </CardContent>
              ) : (
                <CardContent className='pt-4'>
                  This project is proprietary to the company — no public link available 😥
                </CardContent>
              )}
            </Card>
          </div>
        ))}
      </div>
      <div className='h-[90vh]'/>

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
