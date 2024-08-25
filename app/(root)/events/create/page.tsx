import EventForm from '@/components/shared/EventForm';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

const CreateEvent = () => {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;

 

    return (
        <div className='bg-[#0e0e0e]'>
            <div className='bg-[#0e0e0e] bg-cover bg-center py-5 md:py-10'>
                <h3 className='wrapper text-white h3-bold text-center sm:text-left'>Create Event</h3>
            </div>
            <div className='wrapper bg-[#0e0e0e] my-8'>
                <EventForm userId={userId} type="Create" />
            </div>
        </div>
    );
};

export default CreateEvent;
