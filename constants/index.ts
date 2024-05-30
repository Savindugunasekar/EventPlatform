import { Ticket } from "@/lib/database/models/event.model"

export const headerLinks = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'Create Event',
      route: '/events/create',
      role:'org:admin'
    },
    {
      label: 'My Profile',
      route: '/profile',
    },
  ]
  
  export const eventDefaultValues = {
    title: '',
    description: '',
    location: '',
    organizer:'',
    imageUrl: '',
    startDateTime: new Date(),
    
    prices:[] as Ticket[]
    
  }
  