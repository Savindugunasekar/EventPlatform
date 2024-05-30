import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Navitems from './Navitems'
import Mobilenav from './Mobilenav'
import { Button } from '../ui/button'

const Header = () => {
  return (
    <header className='w-full border-b border-[#ffd700] bg-[#0e0e0e]'>

        <div className='wrapper  flex items-center justify-between'>

        <Link href={'/'} className='w-36'>
            <h1 className='h3-bold text-[#ffd700]'>SLEvents</h1>
               
            </Link>

            <SignedIn>
                <nav className='md:flex-between hidden max-w-xs'>
                    <Navitems/>
                </nav>
            </SignedIn>

            <div className='flex w-32 justify-end gap-3'>

                <SignedIn>
                    <UserButton afterSignOutUrl='/'/>
                    <Mobilenav/>
                   
                    
                </SignedIn>
                <SignedOut>
                    <Button asChild className='rounded-full bg-[#ffd700] hover:bg-[#ffd700]/90' size={'lg'}>
                        <Link href={'/sign-in'}>
                            Login
                        </Link>
                    </Button>
                </SignedOut>
            </div>

        </div>

    </header>
  )
}

export default Header