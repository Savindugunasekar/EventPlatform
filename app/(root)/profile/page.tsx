import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser, getOrdersByUser } from '@/lib/actions/event.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'

const ProfilePage =async ({searchParams}:SearchParamProps) => {

    const {sessionClaims} = auth();

    const userId= sessionClaims?.userId as string

    const ordersPage = Number(searchParams?.ordersPage) ||1

    const eventsPage = Number(searchParams?.eventsPage) ||1


    const organizedEvents = await getEventsByUser({userId,page:eventsPage})

    const orders = await getOrdersByUser({userId,page:ordersPage})

    const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];


  return (
    <>

    {/* My Tickets */}

    <div className="bg-[#333]  bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left text-white">My Tickets</h3>

          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </div>


      <div className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="No event tickets purchased yet "
          emptyStateSubtext="Plenty of exciting events to explore!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          totalPages={orders?.totalPages}
          urlParamName="ordersPage"
        />
      </div>

    {/* events organized */}

    <div className="bg-[#333] bg-cover bg-center py-5 md:py-10 mb-20">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left text-white">Events organized</h3>

          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </div>

      <div >
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType='Events_Organized'
          limit={3}
          page={eventsPage}
          totalPages={organizedEvents?.totalPages}
          urlParamName="eventsPage"
        />
      </div>




    </>
  )
}

export default ProfilePage