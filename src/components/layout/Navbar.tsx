import { NavigationMenu, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  const isProduction = process.env.NODE_ENV === 'production'
  
  return (
    <NavigationMenu className='mx-auto w-full max-w-4xl bg-white'>
      <NavigationMenuList className='flex justify-center items-center p-4 gap-8'>
        <NavigationMenuLink asChild>
          <Link href='/' className='text-lg px-6 py-2 rounded hover:bg-gray-100 transition'>
            Home
          </Link>
        </NavigationMenuLink>
        
        <NavigationMenuLink asChild>
          <Link href='/gallery' className='text-lg px-6 py-2 rounded hover:bg-gray-100 transition'>
            Gallery
          </Link>
        </NavigationMenuLink>
        
        <NavigationMenuLink asChild>
          <Link href='/map' className='text-lg px-6 py-2 rounded hover:bg-gray-100 transition'>
            Map
          </Link>
        </NavigationMenuLink>
        
        {!isProduction && session && (
          <NavigationMenuLink asChild>
            <Link href='/upload' className='text-lg px-6 py-2 rounded hover:bg-gray-100 transition'>
              Upload
            </Link>
          </NavigationMenuLink>
        )}
        
        {!isProduction && session && (
          <NavigationMenuLink asChild>
            <Link href='/admin' className='text-lg px-6 py-2 rounded hover:bg-gray-100 transition'>
              Admin
            </Link>
          </NavigationMenuLink>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
