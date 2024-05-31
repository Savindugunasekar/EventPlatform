'use client'
import { useEffect, useState } from 'react'
import SliderComponent from './SliderComponent';
import { getSlides } from '@/lib/actions/event.actions'; // Assuming getSlides is asynchronous
import { IEvent } from '@/lib/database/models/event.model';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const ImageSlider = () => {
    const [events, setEvents] = useState<IEvent[]>([]); // Initialize events as an empty array
    const [currIndex, setCurrIndex] = useState(0);

    useEffect(() => {
        // Fetch events when the component mounts
        const fetchEvents = async () => {
            try {
                const slides = await getSlides();
                setEvents(slides);
                
            } catch (error) {
                console.error('Error fetching slides:', error);
            }
        };

        fetchEvents(); // Call the async function to fetch events

        // Cleanup function for the effect
        
    }, []); // Empty dependency array means this effect runs only once, on mount

    useEffect(() => {
        // Set interval to switch slides automatically
        const intervalId = setInterval(() => {
            nextSlide();
        }, 5000);

        // Cleanup function to clear interval when component unmounts or currIndex changes
        return () => {
            clearInterval(intervalId);
        };
    }, [currIndex]); // Run effect when currIndex changes

    const nextSlide = () => {
        const lastSlide = currIndex === events.length - 1;
        const newIndex = lastSlide ? 0 : currIndex + 1;
        setCurrIndex(newIndex);
    };

    const prevSlide = () => {
        const firstSlide = currIndex === 0;
        const newIndex = firstSlide ? events.length - 1 : currIndex - 1;
        setCurrIndex(newIndex);
    };

    // Ensure events[currIndex] exists before accessing it
    const currentEvent = events.length > 0 ? events[currIndex] : null;

    return (
        <div className='w-full h-[70vh] relative group'>
            {currentEvent && <SliderComponent currentEvent={currentEvent} />}


            <FontAwesomeIcon icon={faChevronLeft} className='text-white' onClick={prevSlide}/>

            <FontAwesomeIcon icon={faChevronRight} className='text-white' onClick={nextSlide}/>

            
        </div>
    );
};

export default ImageSlider;
