import { Landing } from '@/components/sections/Landing'
import { Projects } from '@/components/sections/Projects'
import { Contact } from '@/components/sections/Contact'
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