'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'


interface Ticket {
    ticketCategory: string;
    price: string;
    amount: string;
}
const Ticketselect: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([{ ticketCategory: '', price: '', amount: '' }]);
  
    const handleClick = () => {
      setTickets([...tickets, { ticketCategory: '', price: '', amount: '' }]);
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
      const { name, value } = e.target;
      const updatedTickets = [...tickets];
      updatedTickets[i][name as keyof Ticket] = value;
      setTickets(updatedTickets);
    };
  
    const handleDelete = (i: number) => {
      const updatedTickets = [...tickets];
      updatedTickets.splice(i, 1);
      setTickets(updatedTickets);
    };
  
    const submitTickets = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(tickets);
    };
  
    return (
      <div className="App">
        <Button onClick={handleClick}>Add</Button>
        <form onSubmit={submitTickets}>
          {tickets.map((val, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <label>
                Ticket Category:
                <input
                  name="ticketCategory"
                  value={val.ticketCategory}
                  onChange={(e) => handleChange(e, i)}
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={val.price}
                  onChange={(e) => handleChange(e, i)}
                />
              </label>
              <label>
                Amount:
                <input
                  type="number"
                  name="amount"
                  value={val.amount}
                  onChange={(e) => handleChange(e, i)}
                />
              </label>
              <Button type="button" onClick={() => handleDelete(i)}>Delete</Button>
            </div>
          ))}
          <Button type="submit">Submit</Button>
        </form>
        <p>{JSON.stringify(tickets)}</p>
      </div>
    );
};
  
export default Ticketselect;
