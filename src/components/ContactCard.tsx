import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export const ContactCard = () => {
  return (
    <Card className='
            bg-white/70
            backdrop-blur-md
            rounded-none
            p-30
          '>
      <CardContent className='flex flex-col items-center space-y-8'>
        <div className='flex flex-col items-center space-y-6 text-center'>
          <p className='uppercase text-sm tracking-widest'>( CONTACT ME )</p>
          <Link href='mailto:kiiro.huang@outlook.com'>E-mail</Link>
          <Link href='https://www.linkedin.com/in/kiiroh/'>LinkedIn</Link>
        </div>
      </CardContent>
    </Card>
  )
}
