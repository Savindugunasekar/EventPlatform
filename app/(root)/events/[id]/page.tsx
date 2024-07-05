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

export interface boughtTicket {
  ticketType: String;
  purchasedNumber: number;
}

const EventDetails: React.FC<SearchParamProps> = ({ params: { id } }) => {
  const [event, setEvent] = useState<IEvent | null>(null);
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const userEmail = user?.publicMetadata.useremail as string;

  const [numTickets, setNumTickets] = useState<{ [key: string]: number }>({});
  const [totalAmount, setTotalAmount] = useState<string>('0.00');
  const [purchasedTickets, setPurchasedTickets] = useState<boughtTicket[]>([]);
  const [remainingTickets, setRemainingTickets] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getEventById(id);
      setEvent(event);
      setNumTickets(Object.fromEntries(event.prices.map((ticket: Ticket) => [ticket.ticketCategory, 0])));
      setRemainingTickets(Object.fromEntries(event.prices.map((ticket: Ticket) => [ticket.ticketCategory, ticket.amount])));
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
    setRemainingTickets((prevState) => ({
      ...prevState,
      [ticketCategory]: prevState[ticketCategory] - 1,
    }));
  };

  const removeTicket = (ticketCategory: string) => {
    if (numTickets[ticketCategory] > 0) {
      setNumTickets((prevState) => ({
        ...prevState,
        [ticketCategory]: prevState[ticketCategory] - 1,
      }));
      setRemainingTickets((prevState) => ({
        ...prevState,
        [ticketCategory]: prevState[ticketCategory] + 1,
      }));
    }
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    const updatedPurchasedTickets: boughtTicket[] = [];

    event.prices.forEach((ticket) => {
      const ticketAmount = parseFloat(ticket.price) * numTickets[ticket.ticketCategory];
      totalAmount += ticketAmount;

      if (numTickets[ticket.ticketCategory] > 0) {
        updatedPurchasedTickets.push({
          ticketType: ticket.ticketCategory,
          purchasedNumber: numTickets[ticket.ticketCategory],
        });
      }
    });

    setTotalAmount(totalAmount.toFixed(2));
    setPurchasedTickets(updatedPurchasedTickets);
    console.log(`purchased tickets are ${purchasedTickets}`);
    
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
        <td>{remainingTickets[ticket.ticketCategory]}</td>
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
          </div>
        </div>

        <div className="w-full h-[1000px]">
          <div className="text-white flex justify-center flex-col items-center p-10 h-[100px]">
            <h1 className="text-4xl mb-8">CLOCK IS TICKING...</h1>
            <div className="sm:scale-[65%] md:scale-75 lg:scale-90 xl:scale-100">
              <Countdownbooking isoDateString={event.startDateTime} />
            </div>
          </div>

          <div id="checking" className="mt-[150px]">
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
                        <th>Remaining Tickets</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateTableRows()}
                      <tr>
                        <td className="font-bold">Total</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="font-bold">{totalAmount} LKR</td>
                      </tr>
                    </tbody>
                  </table>
                  <div>
                    <StripeForm event={event} userEmail={userEmail} userId={userId} totalAmount={totalAmount} purchasedTickets={purchasedTickets} />
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
