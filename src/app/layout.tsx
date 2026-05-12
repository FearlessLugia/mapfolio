import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { FooterClient } from '@/components/layout/FooterClient'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Kiiro Huang',
  description: 'Software Engineer based in Toronto, ON',
  icons: {
    icon: '/favicon.svg'
  }
}

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
    >

    <Navbar/>
    {children}
    <FooterClient/>

    </body>
    </html>
  )
}
