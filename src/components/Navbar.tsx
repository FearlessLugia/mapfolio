import { NavigationMenu, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <NavigationMenu className='w-full max-w-4xl bg-white rounded-lg'>
      <NavigationMenuList className='flex justify-around p-4'>
        <Link href='/' legacyBehavior passHref>
          <NavigationMenuLink className='px-4 py-2 rounded hover:bg-gray-100 transition'>Home</NavigationMenuLink>
        </Link>
        <Link href='/gallery' legacyBehavior passHref>
          <NavigationMenuLink className='px-4 py-2 rounded hover:bg-gray-100 transition'>Gallery</NavigationMenuLink>
        </Link>
        <Link href='/map' legacyBehavior passHref>
          <NavigationMenuLink className='px-4 py-2 rounded hover:bg-gray-100 transition'>Map</NavigationMenuLink>
        </Link>
        <Link href='/upload' legacyBehavior passHref>
          <NavigationMenuLink className='px-4 py-2 rounded hover:bg-gray-100 transition'>Upload</NavigationMenuLink>
        </Link>
      </NavigationMenuList>
    </NavigationMenu>
  )
}