import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import MapPreview from '@/components/cards/MapPreview'

export const About = () => {
  return (
    <section className='container mx-auto px-4 py-24'>
      <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-8'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight mb-4'>
            My Photography Journey
          </h2>
          <p className='text-muted-foreground mb-6'>
            I&#39;ve captured moments across the globe, from bustling cities to serene landscapes.
            Each photo tells a story of my adventures and the beautiful places I&#39;ve visited.
          </p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Button asChild>
              <Link href='/map'>
                Explore Map <MapPin className='ml-2 h-4 w-4'/>
              </Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/gallery'>
                View Gallery <ArrowRight className='ml-2 h-4 w-4'/>
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-full md:w-auto md:h-auto md:justify-self-end ">
          <div className="w-full h-full md:w-100 md:h-100 rounded-lg overflow-hidden border flex items-center justify-center">
            <MapPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
