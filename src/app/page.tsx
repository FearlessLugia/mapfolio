import { Landing } from '@/components/Landing'
import { Projects } from '@/components/Projects'
import { Contact } from '@/components/Contact'
import React from 'react'

export default function Home() {
  return (
    <main>
      <Landing/>
      <Projects/>
      <Contact/>
    </main>
  )
}