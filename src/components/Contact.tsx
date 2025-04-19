'use client'

import React, { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Img {
  src: string
  alt: string
}

interface LayeredImagesProps {
  images: Img[]
}

export const Contact: React.FC<LayeredImagesProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const panelRefs = useRef<HTMLDivElement[]>([]) // 保存 panel DOM

  const setPanelRef = (el: HTMLDivElement | null, i: number) => {
    if (el) panelRefs.current[i] = el
  }

  useLayoutEffect(() => {
    if (!containerRef.current) return

    // zIndex initialization, the last image is on top
    gsap.set(panelRefs.current, {
      zIndex: (_i, _t, targets) => targets.length - _i
    })

    // core animation: all panels except the last one slide up 100% of their height
    gsap.to(panelRefs.current.slice(0, -1), {
      yPercent: -100,
      ease: 'none',
      stagger: 0.5,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${images.length * 100}%`, // adjust scroll distance in terms of image count
        scrub: true,
        pin: true
      }
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [images.length])

  return (
    <div
      id='container'
      ref={containerRef}
      className='relative w-full h-screen overflow-hidden'
    >
      {images.map((img, i) => (
        <div
          // every panel is absolutely positioned and fills the screen
          key={img.src}
          ref={el => setPanelRef(el, i)}
          className='panel absolute inset-0 will-change-transform'
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            className='object-cover'
          />
          {/*<div className='absolute inset-0 bg-gradient-to-r from-slate-900'/>*/}
        </div>
      ))}
    </div>
  )
}
