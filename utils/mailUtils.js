
import nodemailer from "nodemailer";

const email =  "savindugunasekara@gmail.com";
const pass = 'rkqkzmckgpxiwhkx';

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: email,
    pass: pass
  },
  debug: true,
  logger: true
});

