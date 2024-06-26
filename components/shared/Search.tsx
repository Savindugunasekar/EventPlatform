'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

const Search = ({placeholder ='Search title...'}:{placeholder?:string}) => {

    const [query,setQuery] = useState('');

    const searchParams = useSearchParams();

    const router = useRouter()

    useEffect(()=>{

        const delayDebounceFn = setTimeout(()=>{

            let newUrl = ''

            if(query){
                 newUrl = formUrlQuery({
                    params:searchParams.toString(),
                    key:'query',
                    value:query
                })
            }
            else{
                newUrl = removeKeysFromQuery({
                    params:searchParams.toString(),
                    keysToRemove:['query']
                })
            }

            router.push(newUrl,{scroll:false})


        },300)

        return ()=> clearTimeout(delayDebounceFn)

    },[query,searchParams,router])


  return (
    <div className="flex-center min-h-[54px] max-w-[600px] overflow-hidden rounded-full bg-[#333] px-4 py-2">
      <FontAwesomeIcon icon={faSearch} className='text-white'/>

      <Input 
      type="text"
      placeholder={placeholder}
      onChange={(e)=>setQuery(e.target.value)}
      className="p-regular-16 border-0 bg-[#333] outline-offset-0 placeholder:text-white focus:border-0 focus-visible:ring-0 text-white focus-visible:ring-offset-0"/>
    </div>
  )
}

export default Search