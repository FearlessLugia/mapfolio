'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export const FooterClient = () => {
  const pathname = usePathname()
  // only show Footer when NOT on homepage
  if (pathname === '/') return null
  return <Footer/>
}
