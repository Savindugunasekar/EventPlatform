import Collection from "@/components/shared/Collection";
import { getAllEvents } from "@/lib/actions/event.actions";


export default async function Home() {


  const events =  await getAllEvents({
    query:'',
    limit:6,
    page:1
  })


  return (

    

    <>

    <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">

    <h2 className="h2-bold text-white">Trust by <br /> Thousands of Events</h2>

    </section>

    <Collection data={events?.data} emptyTitle='No Events Found' emptyStateSubtext = 'Come back later' collectionType='All_Events' limit={6} page={1} totalPages={2}/>
    
    
    </>
  );
}
