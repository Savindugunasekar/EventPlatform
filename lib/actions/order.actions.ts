"use server";

import QRCode from 'qrcode'






import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";
import { transporter } from "../../utils/mailUtils";
import { IEvent } from '../database/models/event.model';
import { json } from 'node:stream/consumers';

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const price = Number(order.price) * 100;

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "lkr",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `https://event-platform-5zju.vercel.app/profile`,
      cancel_url: `https://event-platform-5zju.vercel.app`,
    });
    redirect(session.url!);
  } catch (error) {
    throw error;
  }
};

export const createOrUpdateOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();

    const { eventId, buyerId, totalAmount } = order;
    
    // Check if there is an existing order
    let existingOrder = await Order.findOne({ event: eventId, buyer: buyerId });

    if (existingOrder) {
      // Update the total amount
      const existingTotalAmount = parseFloat(existingOrder.totalAmount);
      const newOrderAmount = parseFloat(totalAmount);
      existingOrder.totalAmount = (existingTotalAmount + newOrderAmount).toString();

      // Save the updated order
      await existingOrder.save();
      return existingOrder.toObject(); // Convert to plain JavaScript object
    } else {
      // Create a new order
      const newOrder = new Order({
        ...order,
        event: eventId,
        buyer: buyerId,
      });

      await newOrder.save();
      return newOrder.toObject(); // Convert to plain JavaScript object
    }
  } catch (error) {
    console.error("Error in createOrUpdateOrder:", error);
    handleError(error);
    throw error;
  }
};
export const sendEmail = async ({
  userEmail,
  totalAmount,
  event,
  userId
}: {
  userEmail: string;
  totalAmount: string;
  event:IEvent;
  userId:string
}) => {
  


  const qrData = JSON.stringify({
    eventId: event._id,
    buyerId: userId,
    eventTitle: event.title,
    price: totalAmount 
  });

  const qrCodeUrl = await QRCode.toDataURL(qrData);

  


 transporter.sendMail({
  from: process.env.MYEMAIL,
  to: userEmail,
  subject: 'Your Order QR Code',
  html: `
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #0056b3;">Your Order QR Code</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">We'll see you at <strong>${event.title}</strong>. Your bill is <strong>Rs${totalAmount}</strong>.</p>
        <p style="font-size: 16px;">Attached is your QR code for the event:</p>
        <div style="text-align: center; margin: 20px 0;">
          <img src="cid:qr-code" alt="QR Code" style="max-width: 200px; border: 1px solid #ddd; border-radius: 4px;" />
        </div>
        <p style="font-size: 16px;">Thank you for your order!</p>
        <p style="font-size: 14px; color: #777;">If you have any questions, feel free to reach out to us.</p>
      </div>
    </body>
    </html>
  `,
  attachments: [
    {
      filename: 'qr-code.png',
        content: qrCodeUrl.split('base64,')[1],
        encoding: 'base64',
    }
  ],
});


};


// transporter.sendMail({
//   from: process.env.MYEMAIL,
//   to: userEmail,
//   subject: 'Your Order QR Code',
//     text: `We'll see you at ${event.title} your bill is Rs${totalAmount}`,
//     attachments: [
//       {
//         filename: 'qr-code.png',
//         content: qrCodeUrl.split('base64,')[1],
//         encoding: 'base64',
//       },
//     ],
// });
// };
