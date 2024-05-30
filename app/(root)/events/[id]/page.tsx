'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faCalendar, faLocationDot, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import '../../../../components/shared/Booking.css';
import '../../../../components/shared/Checkout.css';

import { SearchParamProps } from '@/types';
import { getEventById } from '@/lib/actions/event.actions';
import { formatDateTime } from '@/lib/utils';
import Countdownbooking from '@/components/shared/Countdownbooking';
import { IEvent, Ticket } from '@/lib/database/models/event.model';
import { useUser } from '@clerk/nextjs';
import StripeForm from '@/components/shared/StripeForm';



const EventDetails: React.FC<SearchParamProps> = ({ params: { id } }) => {
  const [event, setEvent] = useState<IEvent | null>(null);

  const {user} = useUser()
  const userId = user?.publicMetadata.userId as string 
  // const hasEventFinished = (event: { startDateTime: string } | null): boolean => {
  //   if (event) {
  //     return new Date(event.startDateTime) < new Date();
  //   }
  //   return false; // or handle the null case appropriately
  // };





  const [numTickets, setNumTickets] = useState<{ [key: string]: number }>({});
  const [totalAmount, setTotalAmount] = useState<string>('0.00');

  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getEventById(id);
      setEvent(event);
      setNumTickets(Object.fromEntries(event.prices.map((ticket: Ticket) => [ticket.ticketCategory, 0])));
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event) {
      calculateTotalAmount();
    }
  }, [numTickets, event]);

  if (!event) return <div>Loading...</div>;

  const addTicket = (ticketCategory: string) => {
    setNumTickets((prevState) => ({
      ...prevState,
      [ticketCategory]: prevState[ticketCategory] + 1,
    }));
  };

  const removeTicket = (ticketCategory: string) => {
    if (numTickets[ticketCategory] > 0) {
      setNumTickets((prevState) => ({
        ...prevState,
        [ticketCategory]: prevState[ticketCategory] - 1,
      }));
    }
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    event.prices.forEach((ticket) => {
      totalAmount += parseFloat(ticket.price) * numTickets[ticket.ticketCategory];
    });

    console.log(totalAmount.toString());
    

    setTotalAmount(totalAmount.toString());
  };

  const generateTableRows = () => {
    return event.prices.map((ticket) => (
      <tr className="bg-[#333]" key={ticket.ticketCategory}>
        <td>{ticket.ticketCategory}</td>
        <td>{parseFloat(ticket.price).toFixed(2)} LKR</td>
        <td>
          <span>
            <FontAwesomeIcon onClick={() => addTicket(ticket.ticketCategory)} icon={faPlus} />
          </span>
          {numTickets[ticket.ticketCategory]}
          <span>
            <FontAwesomeIcon onClick={() => removeTicket(ticket.ticketCategory)} icon={faMinus} />
          </span>
        </td>
        <td>{(parseFloat(ticket.price) * numTickets[ticket.ticketCategory]).toFixed(2)} LKR</td>
      </tr>
    ));
  };

  return (
    <div className="wrappercomp no-scrollbar bg-[#1a1a1a]">
      <div className="wallpaper w-full h-[95vh]">
        <img src={event.imageUrl} alt="Booking wallpaper" className="wallpaperimg w-full h-full object-cover" />
      </div>

      <div className="details flex justify-center bg-[#1a1a1a] flex-col items-center w-full">
        <div className="tile w-[90%] shadow-xl bg-[#0e0e0e] rounded-lg flex translate-y-[-150px]">
          <div className="sm:hidden md:block md:w-1/2 lg:w-1/3 p-8 rounded-lg">
            <img src={event.imageUrl} className="rounded-lg w-full h-full object-cover sm:hidden md:block" alt="" />
          </div>

          <div className="md:w-1/2 lg:w-2/3 p-8 text-white">
            <h1 className="sm:text-center md:text-left text-3xl">{event.title}</h1>
            <p className="mt-5 max-w-[700px]">{event.description}</p>

            <div className="mt-5">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faCalendar} className="text-[#ffd700]" />
                <p>
                  {formatDateTime(event.startDateTime).dateOnly} - {formatDateTime(event.startDateTime).timeOnly}
                </p>
              </div>
              <div className="flex items-center gap-x-3 mb-3">
                <FontAwesomeIcon icon={faLocationDot} className="text-[#ffd700]" />
                <p>{event.location}</p>
              </div>
              <div className="flex items-center gap-x-3 mb-3">
                <FontAwesomeIcon icon={faAward} className="text-[#ffd700]" />
                <p>Organized by {event.organizer}</p>
              </div>
            </div>

           <StripeForm event={event} userId={userId} totalAmount={totalAmount} />
          </div>
        </div>

        <div className="w-full h-[1000px]">
          <div className="text-white flex justify-center flex-col items-center p-10 h-[100px]">
            <h1 className="text-4xl mb-8">CLOCK IS TICKING...</h1>
            <div className="sm:scale-[65%] md:scale-75 lg:scale-90 xl:scale-100">
              <Countdownbooking isoDateString={event.startDateTime} />
            </div>
          </div>

          <div id="ticketsection" className="mt-[150px]">
            <h2 className="h3-bold text-center">Book your tickets..</h2>
            <div className="container bg-[#1a1a1a] h-[100vh] flex justify-center items-center">
              <div className="checkout bg-[#262626] w-[80%] rounded-xl flex shadow-2xl">
                <div className="py-10 px-2 mx-auto">
                  <table className="w-full text-xl">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Price</th>
                        <th>No. of Tickets</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateTableRows()}
                      <tr>
                        <td className="font-bold">Total</td>
                        <td></td>
                        <td></td>
                        <td className="font-bold">{totalAmount} LKR</td>
                      </tr>
                    </tbody>
                  </table>
                  <div>
                    <a
                      className="group relative inline-block overflow-hidden border border-2 rounded-lg border-[#FFD700] px-20 py-4 mt-10 focus:outline-none focus:ring"
                      href="#"
                    >
                      <span className="absolute inset-y-0 left-0 w-[2px] bg-[#FFD700] transition-all group-hover:w-full"></span>
                      <span className="relative text-2xl font-medium text-[#FFD700] transition-colors group-hover:text-black">
                        Checkout
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>   
    </div>
  );
};

export default EventDetails;
