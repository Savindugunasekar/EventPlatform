'use client';
//usepathname only can be used in a client component

import { headerLinks } from '@/constants'
import { useSession } from '@clerk/nextjs';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import {checkUserRole} from '../../utils/userUtils'

const NavItems = () => {
  const pathname = usePathname();
  const {session} = useSession();
  const userRole= checkUserRole(session);

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
     {headerLinks.map((link) => 
  (link.role === 'org:admin' && userRole === 'org:admin') || !link.role ? (
    <li
      key={link.route}
      className={`flex-center p-medium-16 whitespace-nowrap ${pathname === link.route ? 'text-[#ffd700]' : 'text-white'}`}
    >
      <Link href={link.route}>
        {/* Use a div instead of an anchor tag */}
        <div className='mr-5 cursor-pointer hover:text-[#757575]'>
          {link.label}
        </div>
      </Link>
    </li>
  ) : null
)}
    </ul>
  )
}

export default NavItems