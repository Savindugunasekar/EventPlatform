import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'

const ProfilePage =async () => {

    const {sessionClaims} = auth();

    const userId= sessionClaims?.userId as string

    const organizedEvents = await getEventsByUser({userId,page:1})

  return (
    <>

    {/* My Tickets */}

    <section className="bg-[#333]  bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left text-white">My Tickets</h3>

          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

    {/* events organized */}

    <section className="bg-[#333] bg-cover bg-center py-5 md:py-10 mb-20">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left text-white">Events organized</h3>

          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section >
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType='Events_Organized'
          limit={3}
          page={1}
          totalPages={2}
          urlParamName="eventsPage"
        />
      </section>




    </>
  )
}

export default ProfilePage