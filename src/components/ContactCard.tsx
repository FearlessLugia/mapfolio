import { Card, CardContent } from '@/components/ui/card'

export const ContactCard = () => {
  return (
    <Card className='
            bg-white/70
            backdrop-blur-md
            rounded-none
            p-12
          '>
      <CardContent className='flex flex-col items-center space-y-8'>
        <div className='flex flex-col items-center space-y-6 text-center'>
          <p></p>
          <p className='uppercase text-sm tracking-widest'>( CONTACT ME )</p>
          <p className='text-base'>kiiro.huang@outlook.com</p>

          <p></p>
          <p></p>

          <p className='uppercase text-sm tracking-widest'> ( SITE INFORMATION )</p>

          <p className='uppercase text-sm tracking-widest'>( TECHNOLOGY )</p>
          <p className='text-base'> Next.js / TypeScript </p>
          <p className='text-base'> Tailwind CSS / GSAP / shadcn</p>
          <p className='text-base'> PostgreSQL / Supabase / Prisma </p>
          <p className='text-base'> Mapbox API / Amazon S3 / Digital Ocean </p>

          <p className='uppercase text-sm tracking-widest'>( DEPLOY )</p>
          <p className='text-base'>Vercel</p>
        </div>
      </CardContent>
    </Card>
  )
}
