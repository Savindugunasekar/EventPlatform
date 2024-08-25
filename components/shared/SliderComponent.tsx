"use client";
import { IEvent } from "@/lib/database/models/event.model";
import React, { useEffect, useState } from "react";

import Countdown from "./Countdown";
import Link from "next/link";
import { Button } from "../ui/button";
import './Slider.css'

interface SliderComponentProps {
  currentEvent: IEvent;
}

const SliderComponent = ({ currentEvent }: SliderComponentProps) => {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    // Trigger slide animation when props change
    setSlideIn(true);
    // Reset slideIn after animation completes
    const timeout = setTimeout(() => {
      setSlideIn(false);
    }, 1000); // Adjust this timeout to match your CSS animation duration
    return () => clearTimeout(timeout);
  }, [currentEvent]);
  return (

    <div className={` ${slideIn ? "animate-slidein" : ""}`}>
    {/* <div className="hidden lg:block ">
    <div className="container-full  h-[70vh] items-center bg-[#0e0e0e] w-full flex px-3">
      <div className="w-[35%]">
        <h1 className="p-4 text-white text-5xl mb-10">{currentEvent.title}</h1>
        <div>
          <Countdown isoDateString={currentEvent.startDateTime} />
        </div>
        <div className="mt-20 pl-2">
        <Button asChild>
              <Link href={`/events/${currentEvent._id}`}>
              Book Now
              </Link>
             
            </Button>
        </div>

        
      </div>
      <div className="w-[65%]  ">
        <img
          className="h-[70vh] rounded-[30px] w-full object-cover"
          src={currentEvent.imageUrl}
          alt=""
        />
      </div>
    </div>
  </div>
 */}

  <div className="h-[90vh] w-full relative ">
    <img className="h-full w-full object-cover " src={currentEvent.imageUrl} alt="" />
    <div className="bg-gradient-to-r from-[#0e0e0e] to-none absolute top-0 h-full w-full opacity-90">
    <div className="absolute sm:bottom-2 md:bottom-1/4 lg:top-1/4">
    <h1 className="px-10 text-white sm:text-2xl lg:text-5xl sm:mb-3 lg:mb-10">{currentEvent.title}</h1>
        <div className="mx-10">
          <Countdown isoDateString={currentEvent.startDateTime}/>
        </div>
        <div className=" mt-5 md:mt-10 pl-2">


        <Link href={`/events/${currentEvent._id}`} legacyBehavior>
      <a
        className=" group relative inline-block overflow-hidden  border-2 rounded-lg border-[#FFD700] px-20 py-3 focus:outline-none focus:ring mx-10"
      >
        <span className="absolute inset-y-0 left-0 w-[2px] bg-[#FFD700] transition-all group-hover:w-full"></span>
        <span className="relative text-lg font-medium text-[#FFD700] transition-colors group-hover:text-black">
          Book Now
        </span>
      </a>
    </Link>
    </div>
        </div>
    </div>
  </div>
  </div>
  

  )
    
};

export default SliderComponent;
