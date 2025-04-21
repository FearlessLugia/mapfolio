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
        <Link href='/' legacyBehavior passHref>
          <NavigationMenuLink
            className='text-lg px-6 py-2 rounded hover:bg-gray-100 transition'>
            Home
          </NavigationMenuLink>
        </Link>
        <Link href='/gallery' legacyBehavior passHref>
          <NavigationMenuLink
            className='text-lg px-6 py-2 rounded hover:bg-gray-100 transition'>
            Gallery
          </NavigationMenuLink>
        </Link>
        <Link href='/map' legacyBehavior passHref>
          <NavigationMenuLink
            className='text-lg px-6 py-2 rounded hover:bg-gray-100 transition'>
            Map
          </NavigationMenuLink>
        </Link>
        {!isProduction && session && <Link href='/upload' legacyBehavior passHref>
          <NavigationMenuLink
            className='text-lg px-6 py-2 rounded hnover:bg-gray-100 transition'>
            Upload
          </NavigationMenuLink>
        </Link>}
        {!isProduction && session && <Link href='/admin' legacyBehavior passHref>
          <NavigationMenuLink
            className='text-lg px-6 py-2 rounded hover:bg-gray-100 transition'>
            Admin
          </NavigationMenuLink>
        </Link>}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
