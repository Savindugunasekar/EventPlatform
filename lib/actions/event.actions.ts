'use server'
import { CreateEventParams,DeleteEventParams,GetAllEventsParams, UpdateEventParams,GetEventsByUserParams } from "@/types";
import { connectToDatabase } from "../database";
import Event from "../database/models/event.model";
import User from "../database/models/user.model";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";




export const createEvent = async ({event,userId,path}:CreateEventParams) =>{
    try{

        await connectToDatabase();

        const organizer = await User.findById(userId);

        if (!organizer){
            throw new Error("Organizer not found")
        }

        const newEvent = await Event.create({...event, admin:userId})

        return JSON.parse(JSON.stringify(newEvent))

    }catch(error){
        console.log(error);
        
    }
}

export const getEventById =async (eventId:string)=>{
    try{

        await connectToDatabase();

        const event = await Event.findById(eventId);

        if(!event){
            throw new Error('Event not found')
        }

        return JSON.parse(JSON.stringify(event))


    }catch(error){
        handleError(error)
    }
}

export const getAllEvents = async ({query,limit=6,page}:GetAllEventsParams)=>{
    try{

        await connectToDatabase();
        const conditions ={};

        const events = await Event.find(conditions)
        .sort({createdAt:'desc'})
        .skip(0)
        .limit(limit)

        const eventsCount= await Event.countDocuments(conditions);

        return{
            data:JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventsCount/limit)
        }




        
    }catch(error){
        handleError(error)
    }
}

export const deleteEvent = async ({eventId,path}:DeleteEventParams)=>{

    try{

        await connectToDatabase();

        const deletedEvent = await Event.findByIdAndDelete(eventId)

        if (deletedEvent) revalidatePath(path)

    }catch(error){
        handleError(error)
    }

}


export const updateEvent = async({userId,event,path}:UpdateEventParams)=>{

    try{

        await connectToDatabase();

        const eventToUpdate = await Event.findById(event._id)

        console.log(`event to update is $${JSON.stringify(eventToUpdate)}`);
        

        if(!eventToUpdate || eventToUpdate.admin.toHexString()!==userId){
            throw new Error ('Unauthorized or event not found')
        }

        const updatedEvent = await Event.findByIdAndUpdate(event._id,{...event})

        console.log(`final updated event is $${JSON.stringify(updatedEvent)}`);

        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedEvent))


    }catch(error){
        console.log(error);
        
    }
}

export const getEventsByUser = async({userId,limit=6,page}:GetEventsByUserParams)=>{

    try{

        await connectToDatabase();

        const conditions={admin:userId}
        const skipAmount=(page-1)*limit

        const events= await Event.find(conditions)
        .sort({createdAt:'desc'})
        .skip(skipAmount)
        .limit(limit)

        const eventsCount= await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }



    }catch(error){
        handleError(error)
    }

}