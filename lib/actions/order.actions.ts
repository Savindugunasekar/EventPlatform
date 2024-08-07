"use server";

import QRCode from 'qrcode'






import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";
import { transporter } from "../../utils/mailUtils";
import { IEvent } from '../database/models/event.model';

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
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });
    redirect(session.url!);
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();

    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    console.error("Error in createOrder:", error);
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
      text: `We'll see you at ${event.title} your bill is Rs${totalAmount}`,
      attachments: [
        {
          filename: 'qr-code.png',
          content: qrCodeUrl.split('base64,')[1],
          encoding: 'base64',
        },
      ],
  });
};
