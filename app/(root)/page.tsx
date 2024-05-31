import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";


export default async function Home({searchParams}:SearchParamProps) {

  const page = Number(searchParams?.page) ||1;
  const searchText = (searchParams?.query as string)||''


  const events =  await getAllEvents({
    query:searchText,
    limit:6,
    page
  })


  return (

    

    <>

    <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">

    <h2 className="h2-bold text-white">Trust by <br /> Thousands of Events</h2>

    <Search/>

    </section>

    <Collection data={events?.data} emptyTitle='No Events Found' emptyStateSubtext = 'Come back later' collectionType='All_Events' limit={6} page={page} totalPages={events?.totalPages}/>
    
    
    </>
  );
}
