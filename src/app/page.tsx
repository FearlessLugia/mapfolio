import { Landing } from '@/components/Landing'
import { Projects } from '@/components/Projects'
import { Contact } from '@/components/Contact'
import React from 'react'

export default function Home() {
  const images = [
    {
      src: '/background2.jpg',
      alt: 'background2.jpg'
    },
    {
      src: '/background.jpg',
      alt: 'background.jpg'
    }
  ]

  return (
    <main>
      <Landing/>
      <Projects/>
      <Contact images={images}/>
    </main>
  )
}