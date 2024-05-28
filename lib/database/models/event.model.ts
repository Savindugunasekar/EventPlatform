import { Schema, model, models } from "mongoose";

const priceSchema = new Schema({
    ticketCategory:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true

    },
    amount:{
        type:Number,
        required:true
    }
})

const eventSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    location:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    organizer:{
        type:String
    },
    imageUrl:{
        type: String, required: true
    },
    startDateTime:{
        type: Date, default: Date.now 
    },
    prices:[priceSchema],
    admin:{
        type:Schema.Types.ObjectId, ref:'User'
    }


})

const Event = models.Event || model('Event',eventSchema)

export default Event;


