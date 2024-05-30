'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import "./Checkout.css";

const Checkout: React.FC<{ ticketData: { ticketCategory: string, price: string }[] }> = ({ ticketData }) => {
  const [numTickets, setNumTickets] = useState<{ [key: string]: number }>(
    Object.fromEntries(ticketData.map(ticket => [ticket.ticketCategory, 0]))
  );

  const addTicket = (ticketCategory: string) => {
    setNumTickets(prevState => ({
      ...prevState,
      [ticketCategory]: prevState[ticketCategory] + 1
    }));
  };

  const removeTicket = (ticketCategory: string) => {
    if (numTickets[ticketCategory] > 0) {
      setNumTickets(prevState => ({
        ...prevState,
        [ticketCategory]: prevState[ticketCategory] - 1
      }));
    }
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    ticketData.forEach(ticket => {
      totalAmount += parseInt(ticket.price) * numTickets[ticket.ticketCategory];
    });
    return totalAmount.toFixed(2);
  };

  function generateTableRows() {
    return ticketData.map(ticket => (
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
  }

  return (
    <div className="container bg-[#1a1a1a] h-[100vh] flex justify-center items-center ">
      <div className="checkout bg-[#262626] w-[80%] rounded-xl flex shadow-2xl ">
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
                <td className="font-bold">{calculateTotalAmount()} LKR</td>
              </tr>
            </tbody>
          </table>
          <div>
            <a
              className="group relative inline-block overflow-hidden border border-2 rounded-lg border-[#FFD700] px-20 py-4 mt-10 focus:outline-none focus:ring"
              href="#"
            >
              <span className="absolute inset-y-0 left-0 w-[2px] bg-[#FFD700] transition-all group-hover:w-full "></span>
              <span className="relative text-2xl font-medium text-[#FFD700] transition-colors group-hover:text-black">
                Checkout
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
