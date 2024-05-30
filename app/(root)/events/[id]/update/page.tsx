import EventForm from '@/components/shared/EventForm';
import { getEventById } from '@/lib/actions/event.actions';
import { auth } from '@clerk/nextjs/server';
import React from 'react';


type UpdateEventProps = {
  params:{
    id:string
  }
}


const UpdateEvent = async({params:{id}}:UpdateEventProps) => {

  const {sessionClaims} = auth();

  const userId = sessionClaims?.userId as string;

  const event = await getEventById(id);

    
    

    return (
        <div className='bg-[#0e0e0e]'>
            <section className='bg-[#0e0e0e] bg-cover bg-center py-5 md:py-10'>
                <h3 className='wrapper text-white h3-bold text-center sm:text-left'>Update Event</h3>
            </section>
            <div className='wrapper bg-[#0e0e0e] my-8'>
                <EventForm userId={userId} type="Update"
                event={event} eventId={event._id} />
            </div>
        </div>
    );
};

export default UpdateEvent;
