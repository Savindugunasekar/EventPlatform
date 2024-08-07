
import { IEvent } from '@/lib/database/models/event.model';
import React, { useEffect } from 'react'
import { Button } from '../ui/button';

import { loadStripe } from '@stripe/stripe-js';
import { checkoutOrder, sendEmail } from '@/lib/actions/order.actions';
import { boughtTicket } from '@/app/(root)/events/[id]/page';
import { changeTickets } from '@/lib/actions/event.actions';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const StripeForm = ({event,userId,totalAmount,purchasedTickets,userEmail}:{event:IEvent,userId:string,totalAmount:string,userEmail:string ,purchasedTickets:boughtTicket[]}) => {

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
          console.log('Order placed! You will receive an email confirmation.');
        }
    
        if (query.get('canceled')) {
          console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
      }, []);





      
      


    const onCheckout = async ()=>{
        const order = {
            eventTitle:event.title,
            eventId:event._id,
            price:totalAmount,
            
            buyerId:userId
        }

        await checkoutOrder(order)

        await changeTickets({event,purchasedTickets})

        await sendEmail({userEmail,totalAmount,event,userId})
        

    }

  return (
    <form action={onCheckout} method='POST'>
        <Button type='submit' role='link' size={'lg'} className='button sm:w-fit'>Checkout</Button>
    </form>
  )
}

export default StripeForm