"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocation } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { eventDefaultValues } from "@/constants";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { eventFormSchema } from "@/lib/validator";
import { Textarea } from "../ui/textarea";
import FileUploader from "./FileUploader";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { IEvent, Ticket } from "@/lib/database/models/event.model";



type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
  event?:IEvent
  eventId?:string
};

interface Formdata {
  title: string;
  description: string;
  organizer: string;
  location: string;
  imageUrl: string;
  startDateTime: Date;
}

interface IxEvent {
  title: string;
  description?: string;
  location?: string;
  organizer?: string;
  imageUrl: string;
  startDateTime: Date;
  prices: Ticket[];
}

const EventForm = ({ userId, type ,event,eventId }: EventFormProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([
    { ticketCategory: "", price: "", amount: "" },
  ]);

  const handleClick = () => {
    setTickets([...tickets, { ticketCategory: "", price: "", amount: "" }]);
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
    setTickets(tickets);
  };

  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<Formdata>({} as Formdata);

  const initialValues = event && type==='Update'?{
    ...event,startDateTime:new Date(event.startDateTime)
  }: eventDefaultValues;
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");

  // 1. Define your form.
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    setFormData({ ...values, imageUrl: uploadedImageUrl });
  }

  const submitAll = async () => {
    const eventData = { ...formData, prices: tickets };
    console.log(eventData);
    

    if(type==='Create'){

      try {
        const newEvent = await createEvent({
          event: eventData,
          userId,
          path: "/profile",
        });
  
        console.log(eventData);
  
        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if(type==='Update'){
      if(!eventId){
        router.back()
        return
      }

      try{

        const updatedEvent= await updateEvent({
          userId,
          event:{...eventData,_id:eventId},
          path:`/events/${eventId}`
        })

        console.log(`updated event is ${updatedEvent}`);
        

        if (updatedEvent){
          form.reset();
          router.push(`/events/${updatedEvent._id}`)
        }

      }catch(error){
        console.log(error);
        
      }
    }




    
  

    }
    
    
   
    

    
  return (
    <>
      <Form  {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 bg-[#0e0e0e]"
        >
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                    
                      placeholder="Event title"
                      {...field}
                      className="input-field text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizer"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Organized by"
                      {...field}
                      className="input-field text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <Textarea
                      placeholder="Description"
                      {...field}
                      className="textarea text-white rounded-2xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <FileUploader
                      onFieldChange={field.onChange}
                      imageUrl={field.value}
                      setFiles={setFiles}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-[#333] py-2">
                      
                      <Input
                        placeholder="Event location or Online :"
                        {...field}
                        className="input-field text-white"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="startDateTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-[#333]  py-2">
                      
                      <p className="ml-3 whitespace-nowrap text-white">
                        Start Date:
                      </p>
                      <DatePicker
                        selected={field.value}
                        onChange={(date: Date) => field.onChange(date)}
                        showTimeSelect
                        timeInputLabel="Time"
                        dateFormat={"MM/dd/yyyy h:mm aa"}
                        wrapperClassName="datePicker"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-[200px] rounded-full"
           
            disabled={form.formState.isSubmitting}
           
          >
            {form.formState.isSubmitting
              ? "Uploading..."
              : `Upload info`}
          </Button>
        </form>
      </Form>

      <section className="mt-10">
        <h2 className="h3-bold mb-5 text-white">Add Tickets</h2>
        <Button className="rounded-full p-5" onClick={handleClick}>Add</Button>
        <form onSubmit={submitTickets}>
          {tickets.map((val, i) => (
            <div className="flex flex-col gap-5 md:flex-row my-3 items-center" key={i} >
              
                <input
                className="input-field w-full"
                placeholder="ticketCategory"
                  name="ticketCategory"
                  value={val.ticketCategory}
                  onChange={(e) => handleChange(e, i)}
                />
             
              
                <input
                placeholder="Price"
                className="input-field w-full"
                  type="number"
                  name="price"
                  value={val.price}
                  onChange={(e) => handleChange(e, i)}
                />
              
              
                
                <input
                placeholder="Amount"
                  type="number"
                  name="amount"
                  className="input-field w-full"

                  value={val.amount}
                  onChange={(e) => handleChange(e, i)}
                />
              
              <Button className="rounded-full p-5" type="button" onClick={() => handleDelete(i)}>
                Delete
              </Button>
            </div>
          ))}
         
        </form>
        
      </section>

      <section className="mt-[50px]" >
        <Button className=" button col-span-2 w-full" onClick={submitAll}>Create event</Button>

      
        
      </section>
    </>
  );
};

export default EventForm;