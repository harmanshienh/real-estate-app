import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import {
    FaBath,
    FaBed,
    FaChair,
    FaParking,
} from 'react-icons/fa';


export default function ListingResult({ listing }) {
    return (
        <div className='bg-slate-100 shadow-md 
        hover:shadow-lg transition-shadow overflow-hidden rounded-lg 
        w-full sm:w-[330px]'>
            <Link to={`/listing/${listing._id}`} className='flex flex-col gap-4'>
                <img src={listing.imageURLs[0]} alt={listing.name}
                    className='h-[180px] sm:h-[220px] w-full object-cover 
                    hover:scale-105 transition-scale duration-300' />
                <div className='p-3 flex flex-col gap-2'>
                    <div className='flex items-center relative group'>
                        <p className='truncate text-lg font-semibold 
                         text-slate-700 hover:underline'>
                            {listing.name}
                        </p>
                        <p className='uppercase text-xs absolute right-0'>
                            {new Date(listing.createdAt).
                                toLocaleString('en-US', {
                                    day: 'numeric',
                                    month: 'long', year: 'numeric'
                                })}
                        </p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <MdLocationOn className='h-4 w-4 text-green-700' />
                        <p className='text-sm text-gray-600 truncate w-full'>
                            {listing.address}
                        </p>
                    </div>
                    <div>
                        <p className='text-sm text-gray-700 line-clamp-2'>
                            {listing.description}
                        </p>
                        <p className='text-red-700 mt-2 font-semibold'>
                            {`$${listing.regularPrice.toLocaleString('en-US')} / month`}
                        </p>
                        <div className='flex gap-4 mt-2'>
                            <div className='flex items-center gap-1'>
                                <FaBed className='h-4 w-4 text-green-700 mt-1' />
                                <span className='text-green-800 font-bold text-sm'>
                                    {listing.bedrooms}
                                </span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <FaBath className='h-4 w-4 text-green-700' />
                                <span className='text-green-800 font-bold text-sm'>
                                    {listing.bathrooms}
                                </span>
                            </div>
                            {listing.parking &&
                                <FaParking className='h-4 w-4 text-blue-700 mt-1 '
                                />}
                            {listing.furnished &&
                                <FaChair className='h-4 w-4 text-amber-900 mt-1 '
                                />}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
