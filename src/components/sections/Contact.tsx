'use client'

import React, { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { ContactCard } from '@/components/cards/ContactCard'
import { SiteInfoCard } from '@/components/cards/SiteInfoCard'

gsap.registerPlugin(ScrollTrigger)

export const Contact = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const panelRefs = useRef<HTMLDivElement[]>([])

  const setPanelRef = (el: HTMLDivElement | null, i: number) => {
    if (el) panelRefs.current[i] = el
  }

  useLayoutEffect(() => {
    if (!containerRef.current) return

    // core animation: all panels except the last one slide up 100% of their height
    gsap.to(panelRefs.current.slice(0, -1), {
      yPercent: -100,
      ease: 'none',
      stagger: 0.5,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: true,
        pin: true
      }
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div
      id='container'
      ref={containerRef}
      className='relative w-full h-screen overflow-hidden'
    >
      <div
        ref={(el) => setPanelRef(el, 0)}
        className='panel absolute inset-0 z-50 flex items-center justify-center will-change-transform'
      >
        <div className='z-50'>
          <ContactCard/>
        </div>

        <Image
          src='/background.jpg'
          alt='a background picture'
          fill
          priority
          className='object-cover z-20'
        />
      </div>

      <div
        ref={(el) => setPanelRef(el, 1)}
        className='panel absolute inset-0 will-change-transform flex items-center justify-center h-screen'
      >
        <div className='z-10'>
          <SiteInfoCard/>
        </div>

        <Image
          src='/background2.jpg'
          alt='a background picture'
          fill
          priority
          className='object-cover z-0'
        />
      </div>
    </div>
  )
}
