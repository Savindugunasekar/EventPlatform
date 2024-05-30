import { IEvent } from "@/lib/database/models/event.model";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";
import "./Show.css";
import Image from "next/image";
import DeleteConfirmation from "./DeleteConfirmation";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;

  const isEventCreator = userId === event.admin.toString();

  toString();
  return (
    <div className=" rounded-lg relative h-[300px] w-full  overflow-hidden ">
       
       <div className="backimage rounded-lg h-full w-full   ">
       <Link href={`/events/${event._id}`}>
       <img
         className="  rounded-lg w-full object-cover h-full hover:scale-110 duration-500"
         src={event.imageUrl}
         alt=""
       />
       </Link>
       
       {/* code for edit and delete */}

       {isEventCreator && !hidePrice && (
            <div className='absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all'>
                <Link href={`/events/${event._id}/update`}>
                <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                    
                </Link>

                <DeleteConfirmation eventId={event._id}/>

            </div>
        )}












       <h1 className=" absolute  left-5   bottom-20 text-2xl text-[#FFD700]">
         {event.title}
       </h1>
       <div className="booking absolute bottom-4 left-5 ">

        <Link href={`/events/${event._id}/#ticketsection`} className="group relative inline-block overflow-hidden  border-2 rounded-lg border-[#FFD700] px-8 py-3 focus:outline-none focus:ring">
       
           
           
         
           <span className="absolute inset-y-0 left-0 w-[2px] bg-[#FFD700] transition-all group-hover:w-full "></span>

           <span className="relative text-md font-medium text-[#FFD700] transition-colors group-hover:text-black">
             Book Now
           </span>
         </Link>

         {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Order Details</p>
              <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
            </Link>
          )}
         
       </div>
     </div>
    
    </div>
  );
};

export default Card;
