import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'

const Footer = () => {
  return (
    <footer className='w-full mt-10 border-t border-[#ffd700] bg-[#0e0e0e] text-[#fff] py-6'>
      <div className='wrapper flex flex-col md:flex-row items-center justify-between'>
        <div className='flex flex-col items-center md:items-start'>
          <h2 className='text-[#ffd700] text-lg font-bold mb-2'>SLEvents</h2>
          <p className='text-center md:text-left mb-4'>
            Bringing the best events to you. Book your tickets now!
          </p>
          <div className='flex gap-3'>
            <Button asChild className='bg-[#ffd700] hover:bg-[#ffd700]/90' size='sm'>
              <Link href='/about-us'>About Us</Link>
            </Button>
            <Button asChild className='bg-[#ffd700] hover:bg-[#ffd700]/90' size='sm'>
              <Link href='/contact-us'>Contact Us</Link>
            </Button>
          </div>
        </div>

        <div className='mt-6 md:mt-0'>
          <h3 className='text-[#ffd700] text-md font-semibold mb-2'>Follow Us</h3>
          <div className='flex gap-4'>
            <Link href='https://facebook.com' className='text-[#ffd700] hover:text-[#fff]'>
              Facebook
            </Link>
            <Link href='https://twitter.com' className='text-[#ffd700] hover:text-[#fff]'>
              Twitter
            </Link>
            <Link href='https://instagram.com' className='text-[#ffd700] hover:text-[#fff]'>
              Instagram
            </Link>
          </div>
        </div>
      </div>

      <div className='text-center mt-6'>
        <p className='text-[#fff]'>
          &copy; {new Date().getFullYear()} SLEvents. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
