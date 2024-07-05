
import Collection from "@/components/shared/Collection";
import ImageSlider from "@/components/shared/ImageSlider";
import Search from "@/components/shared/Search";
import { getAllEvents } from "@/lib/actions/event.actions";
import { sendEmail } from "@/lib/actions/order.actions";
import { SearchParamProps } from "@/types";

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";

  const events = await getAllEvents({
    query: searchText,
    limit: 6,
    page,
  });

  return (
    <>
      
        <ImageSlider />


        
      

      <section className="sm:w-[600px] md:w-[800px]  mt-[100px]  ">
        <h2 className="h2-bold  text-white mb-5 ">Trusted by Thousands of Events</h2>
        

        <Search />
      </section>

      <Collection
        data={events?.data}
        emptyTitle="No Events Found"
        emptyStateSubtext="Come back later"
        collectionType="All_Events"
        limit={6}
        page={page}
        totalPages={events?.totalPages}
      />
    </>
  );
}
