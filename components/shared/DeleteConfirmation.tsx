'use client'
import React, { startTransition, useTransition } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { deleteEvent } from '@/lib/actions/event.actions'
  

const DeleteConfirmation = ({eventId}:{eventId:string}) => {


    const pathname = usePathname();
    let [isPending,startTransition]= useTransition();

  return (
    <AlertDialog>
    <AlertDialogTrigger>
    <Image src="/assets/icons/delete.svg" alt="edit" width={20} height={20} />
    </AlertDialogTrigger>
    <AlertDialogContent className='bg-[#333]'>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
        <AlertDialogDescription className='p-regular-16 text-white'>
        This will permanently delete this event
          
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await deleteEvent({ eventId, path: pathname })
              })
            }>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  
  )
}

export default DeleteConfirmation