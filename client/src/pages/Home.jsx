import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation, EffectFade, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css/bundle'
import TextTransition, { presets } from 'react-text-transition';
import ListingResult from '../components/ListingResult';

export default function Home() {
  const [rentListings, setRentListings] = useState([]);
  const [subleaseListings, setSubleaseListings] = useState([]);
  const [textIndex, setTextIndex] = useState(0);
  const TEXTS = ['Place to live', 'Place to work', 'Home', 'Hangout Spot'];
  SwiperCore.use([Navigation, EffectFade, Pagination, Autoplay]);

  useEffect(() => {
    const intervalId = setInterval(
      () => setTextIndex((textIndex) => textIndex + 1), 3000);
      return () => clearTimeout(intervalId);
  }, [])
  
  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);

      } catch (error) {
        console.log(error);
      }
    }

    const fetchSubleaseListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sublet&limit=4');
        const data = await res.json();
        setSubleaseListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRentListings();
    fetchSubleaseListings();
  }, [])

  return (
    <div>
      <div className='flex flex-col gap-3 py-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Looking for a
        </h1>
        <TextTransition 
          springConfig={presets.stiff} 
          direction='down' 
          className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          {TEXTS[textIndex % TEXTS.length]}?
        </TextTransition>
        <div className='text-gray-600 text-xs sm:text-sm mt-3'>
          Look no further than Waterloo Student Housing!
        </div>
        <Link 
          to={'/search'} 
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Start Browsing...
        </Link>
      </div>

      <Swiper effect={"fade"} pagination={{ clickable: true }} autoplay>
        {rentListings && rentListings.length > 0 && (
          rentListings.map((listing) => (
            <SwiperSlide>
              <div style={{
                background: `url(${listing.imageURLs[0]})
                center no-repeat`,
                backgroundSize: 'cover'
              }}
                className='h-[550px]'
                key={listing._id}>

              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>

      <div className='flex flex-col gap-8 my-10 max-w-6xl mx-auto p-3'>
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className=''>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent postings for Rent
              </h2>
              <Link to={'/search?type=rent'}
                className='text-sm text-blue-800 hover:underline'>
                See more for Rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingResult listing={listing} />
              ))}
            </div>
          </div>
        )}

        {subleaseListings && subleaseListings.length > 0 && (
          <div className=''>
            <div className=''>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent postings for Sublease
              </h2>
              <Link to={'/search?type=sublet'}
                className='text-sm text-blue-800 hover:underline'>
                See more for Sublease
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {subleaseListings.map((listing) => (
                <ListingResult listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div >
  )
}
