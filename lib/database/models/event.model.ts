import { Schema, model, models, Document } from "mongoose";

// Define the Ticket interface
export interface Ticket {
    ticketCategory: string;
    price: string;
    amount: string;
}

// Define the interface for Event, extending Mongoose's Document interface
export interface IEvent extends Document {
    _id:string
    title: string;
    description?: string;
    location?: string;  // Ensure this matches the Mongoose schema definition
    organizer?: string;
    createdAt: Date;
    imageUrl: string;
    startDateTime: Date;
    prices: Ticket[];
    admin: { _id: string; firstName: string; lastName: string };
}

// Define the priceSchema
const priceSchema = new Schema({
    ticketCategory: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
});

// Define the eventSchema
const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    organizer: {
        type: String
    },
    imageUrl: {
        type: String,
        required: true
    },
    startDateTime: {
        type: Date,
        default: Date.now
    },
    prices: [priceSchema],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Create the Event model
const Event = models.Event || model('Event', eventSchema);

export default Event;
