import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { MdEmail, MdLocationOn } from "react-icons/md";
import {
    FaBath,
    FaBed,
    FaChair,
    FaParking,
} from 'react-icons/fa';


export default function UserListings() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [userCreated, setUserCreated] = useState(null);
    const [listings, setListings] = useState([]);

    const params = useParams();

    useEffect(() => {
        const fetchUserAndListings = async () => {
            try {
                setLoading(true);
                const userRes = await fetch(`/api/user/${params.userId}`);
                const userData = await userRes.json();

                const listingRes = await fetch(
                    `/api/user/userListings/${params.userId}`
                );
                const listingData = await listingRes.json();

                if (userData.success === false || listingData.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setProfilePicture(userData.avatar);
                setName(userData.username);
                setEmail(userData.email);
                setUserCreated(userData.createdAt);
                setUser(userData);
                setListings(listingData);
                setLoading(false);

            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchUserAndListings();
    }, [])

    return (
        <main className='flex flex-col'>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 -text-2xl text-red-700'>Error loading user</p>}
            {user && !loading && !error && (
                <>
                    <div className='flex flex-col sm:flex-row mt-3 mx-auto 
                    gap-4 sm:gap-6'>
                        <img src={profilePicture} alt='Profile Picture'
                            className='rounded-full w-44 h-44 object-cover 
                            mx-auto' />
                        <div className='flex flex-col gap-2 mt-2 flex-wrap min-w-64'>
                            <span className='text-3xl font-semibold'>
                                {name}
                            </span>
                            <div className='flex gap-2 items-center'>
                                <MdEmail className='text-2xl text-green-700' />
                                <span className='text-slate-700 font-medium'>
                                    {email}
                                </span>
                            </div>
                            <div className='flex gap-3'>
                                <div className='flex flex-col border-2 py-3 
                        border-red-900 rounded-lg w-1/2 h-full'>
                                    <span className='font-semibold self-center'>
                                        User Since
                                    </span>
                                    <span className='self-center'>
                                        {new Date(userCreated).
                                            toLocaleString('en-US', {
                                                day: '2-digit',
                                                month: '2-digit', year: '2-digit'
                                            })}
                                    </span>
                                </div>
                                <div className='flex flex-col border-2 py-3 
                        border-red-900 rounded-lg w-1/2 h-full'>
                                    <span className='font-semibold self-center min-w-fit whitespace-nowrap'>
                                        # of Listings
                                    </span>
                                    <span className='self-center'>
                                        {listings.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {listings.length > 0 && (
                        <div className='mt-6 mx-auto '>
                            <h1 className='text-3xl font-semibold pl-3'>Listings:</h1>
                            {listings.length > 0 && (
                                <ul className='p-3 space-y-4'>
                                    {listings.map((listing) => (
                                        <div className='space-y-4'>
                                            <Link to={`/listing/${listing._id}`}>
                                                <li key={listing.id}
                                                    className='bg-slate-100 
                                            shadow-sm hover:shadow-lg 
                                            transition-shadow rounded-lg w-full 
                                            sm:w-[500px] sm:h-[200px] h-fit 
                                            flex flex-col gap-4 sm:flex-row 
                                            justify-between overflow-hidden'>
                                                    <div className='p-3 space-y-4'>
                                                        <h1 className='font-semibold 
                                                    text-xl hover:underline'>
                                                            {listing.name}
                                                        </h1>
                                                        <span
                                                            className='text-red-700 
                                                    font-semibold text-md pt-2'>
                                                            ${listing.regularPrice.toLocaleString('en-US')} / mo
                                                        </span>
                                                        <div className='flex 
                                                    items-center gap-1'>
                                                            <MdLocationOn
                                                                className='h-4 w-4 
                                                        text-green-700' />
                                                            <p className='text-sm 
                                                        text-gray-600 
                                                        line-clamp-1 w-full'>
                                                                {listing.address}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <div className='flex gap-4 mt-2'>
                                                                <div className='flex 
                                                            items-center gap-1'>
                                                                    <FaBed
                                                                        className='h-4 w-4 
                                                                text-green-700 mt-1' />
                                                                    <span
                                                                        className='
                                                                    text-green-800 
                                                                    font-bold text-sm'>
                                                                        {listing.bedrooms}
                                                                    </span>
                                                                </div>
                                                                <div className='flex 
                                                            items-center gap-1'>
                                                                    <FaBath
                                                                        className='h-4 w-4 
                                                                text-green-700' />
                                                                    <span
                                                                        className='
                                                                    text-green-800 
                                                                    font-bold text-sm'>
                                                                        {listing.bathrooms}
                                                                    </span>
                                                                </div>
                                                                {listing.parking &&
                                                                    <FaParking
                                                                        className='h-4 w-4 
                                                                text-blue-700 mt-1 '
                                                                    />}
                                                                {listing.furnished &&
                                                                    <FaChair
                                                                        className='h-4 w-4 
                                                                text-amber-900 mt-1 '
                                                                    />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <img src={listing.imageURLs[0]}
                                                        className='rounded-lg p-3 
                                                    object-cover hover:scale-125 
                                                    transition-scale duration-300' />
                                                </li>
                                            </Link>
                                        </div>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </>
            )}
        </main>
    )
}
