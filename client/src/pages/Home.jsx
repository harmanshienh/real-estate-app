import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation, EffectFade, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css/bundle'
import TextTransition, { presets } from 'react-text-transition';
import { TypeAnimation } from 'react-type-animation';
import ListingResult from '../components/ListingResult';
import { FaSearch } from 'react-icons/fa';


export default function Home() {
  const [rentListings, setRentListings] = useState([]);
  const [subleaseListings, setSubleaseListings] = useState([]);
  const [textIndex, setTextIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const TEXTS = ['Place to live', 'Place to work', 'Home', 'Hangout Spot'];

  const navigate = useNavigate();
  const inputRef = useRef(null);

  SwiperCore.use([Navigation, EffectFade, Pagination, Autoplay]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  const handleClick = (e) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

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
      <div className='flex flex-col sm:flex-row justify-between pt-10 pb-16 sm:py-28 px-3 
           max-w-6xl mx-auto sm:items-center'>
        <div className='flex flex-col gap-3'>
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
            Looking for a
          </h1>
          <TextTransition
            springConfig={presets.stiff}
            direction='down'
            className='text-slate-700 font-bold text-3xl lg:text-6xl'>
            {TEXTS[textIndex % TEXTS.length]}?
          </TextTransition>
          <div className='text-gray-600 text-sm -mt-3 sm:mt-7 mb-10'>
            Look no further than Waterloo Student Housing!
          </div>
        </div>
        <form onSubmit={handleSubmit}
              onClick={handleClick}
          className='relative bg-slate-100 group p-3 
                      rounded-full flex items-center gap-2 border-2 
                      focus-within:border-2 focus-within:border-red-500 h-20'>
          <button>
            <FaSearch className='text-slate-600 group-focus-within:text-red-500' />
          </button>
          <input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type='text'
            className='bg-transparent focus:outline-none 
                        hide-placeholder hidden sm:w-64 sm:block' />
          {!searchTerm && (
            <div className="absolute left-7 flex items-center pl-2">
              <TypeAnimation
                sequence={[
                  '2 Bed 1 Bath on Lester', 1000,
                  'CMH Double', 1000,
                  'Luxurious Apartment', 1000,
                  'Icon South for Sublet', 1000
                ]}
                wrapper="span"
                speed={50}
                style={{ fontSize: '1em', color: '#9ca3af' }}
                repeat={Infinity}
              />
            </div>
          )}
        </form>
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
                className='h-[300px] sm:h-[550px]'
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
