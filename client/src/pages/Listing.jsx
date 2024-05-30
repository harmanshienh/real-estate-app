import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { useSelector } from 'react-redux'
import { Navigation, EffectFade, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css/bundle'
import './Listing.css'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact'


export default function Listing() {
    SwiperCore.use([Navigation, EffectFade, Pagination, Autoplay]);

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);

    const params = useParams();
    const navigate = useNavigate();

    const {currentUser} = useSelector((state) => state.user);

    const handleDeleteListing = async (listingId) => {
        try {
          const res = await fetch(`/api/listing/delete/${listingId}`, {
            method: 'DELETE'
          });
    
          const data = await res.json();
    
          if (data.success === false) {
            console.log(data.message);
            return;
          }

          navigate('/profile');
    
        } catch (error) {
          console.log(error);
        }
      }

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get-listing/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setListing(data);
                setLoading(false);

            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId])

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 -text-2xl text-red-700'>Error loading listing</p>}
            {listing && !loading && !error && (
                <div>
                    <Swiper effect={"fade"} pagination={{ clickable: true }} navigation autoplay>
                        {listing.imageURLs.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='h-[550px]'>
                                    <img src={url} className='h-full w-full object-cover' />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare className='text-slate-800'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000)
                            }} />
                    </div>
                    {copied && (<p className='fixed top-[20%] right-[2.5%] z-10 rounded-md bg-slate-100 p-2'>Copied!</p>)}
                    <div className='flex flex-col gap-4 fixed top-[10%] left-[2%] z-10'>
                        <Link to={`/update-listing/${listing._id}`} className='rounded-lg bg-green-700 p-3 text-white font-semibold'>
                            Update
                        </Link>
                        <button onClick={() => handleDeleteListing(listing._id)} className='rounded-lg bg-red-700 p-3 text-white font-semibold'>
                            Delete
                        </button>
                    </div>
                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                        <p className='text-2xl font-semibold'>
                            {listing.name} - ${' '}
                            {listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className='uppercase text-xs'>
                            Posted on {new Date(listing.createdAt).
                            toLocaleString('en-US', { day: 'numeric', 
                            month: 'long', year: 'numeric' })}
                        </p>
                        <p className='flex items-center gap-2 text-slate-600 text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>
                        <div>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                        </div>
                        <p className='whitespace-pre-wrap'>{listing.description}</p>
                        <ul className='flex flex-wrap items-center gap-4 sm:gap-6 text-green-900 font-semibold text-sm'>
                            <li className='flex items-center gap-2 whitespace-nowrap'>
                                <FaBed className='text-lg' /> 
                                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                            </li>
                            <li className='flex items-center gap-2 whitespace-nowrap'>
                                <FaBath className='text-lg' /> 
                                {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}
                            </li>
                            <li className='flex items-center gap-2 whitespace-nowrap'>
                                {listing.parking && (<FaParking className='text-lg' />)}
                                {listing.parking && 'Parking Available'}
                            </li>
                            <li className='flex items-center gap-2 whitespace-nowrap'>
                                {listing.furnished && (<FaChair className='text-lg' />)}
                                {listing.furnished && 'Furnished'}
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                        <button onClick={() => setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>Contact Landlord</button>
                        )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            )}
        </main>
    )
}
