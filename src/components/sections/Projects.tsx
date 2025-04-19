'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { ProjectCard } from '@/components/cards/ProjectCard'

gsap.registerPlugin(ScrollTrigger)

interface CardItem {
  title: string
  description: string
  tags: string[]
  link?: string
}

const items: CardItem[] = [
  {
    title: '3D Network Visualization',
    description: 'A Microservices full-stack application using Node.js and TypeScript, rendering complex 3D network visualizations of coordinates and relational edges from non-hierarchical graph data through React and Three.js',
    tags: ['MERN Stack', 'TypeScript', 'Three.js', 'GraphQL', 'RabbitMQ']
  },
  {
    title: 'Model Diff',
    description: 'A .NET application to efficiently compare different types of 3D models',
    tags: ['C#', '.NET', 'WPF', 'C++', 'CAA', 'Graph Operations', 'XML']
  },
  {
    title: 'Lesty KV',
    description: 'An LSM‑Tree-based key‑value store engine implemented in C++',
    tags: ['C++', 'Database', 'Key‑Value Store'],
    link: 'https://github.com/FearlessLugia/lesty-kv'
  },
  {
    title: 'Rusty DFS',
    description: 'A distributed file storage system implemented in Rust',
    tags: ['Rust', 'Distributed System', 'File Storage'],
    link: 'https://github.com/FearlessLugia/rusty-dfs'
  }
]

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
      const offsetTop = 50 + index * 100
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
        {items.map((item, i) => {
          const offsetTop = 50 + i * 100
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
