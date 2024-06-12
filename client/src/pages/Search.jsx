import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingResult from '../components/ListingResult';
import UserCard from '../components/UserCard';

export default function Search() {
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [allListings, setAllListings] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [showMoreListings, setShowMoreListings] = useState(false);
    const [showMoreUsers, setShowMoreUsers] = useState(false);
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        sort: 'created_at',
        order: 'desc'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const urlSearchTerm = urlParams.get('searchTerm');
        const urlType = urlParams.get('type');
        const urlParking = urlParams.get('parking');
        const urlFurnished = urlParams.get('furnished');
        const urlSort = urlParams.get('sort');
        const urlOrder = urlParams.get('order');

        if (urlSearchTerm || urlType || urlParking || urlFurnished || urlSort || urlOrder) {
            setSidebarData({
                searchTerm: urlSearchTerm || '',
                type: urlType || 'all',
                parking: urlParking === 'true' ? true : false,
                furnished: urlFurnished === 'true' ? true : false,
                sort: urlSort || 'created_at',
                order: urlOrder || 'desc'
            });
        }

        const fetchListingsAndUsers = async () => {
            setLoading(true);
            setShowMoreListings(false);
            setShowMoreUsers(false);

            const searchQuery = urlParams.toString();

            const userRes = await fetch(`/api/user/get?${searchQuery}`);
            const userData = await userRes.json();

            const listingRes = await fetch(`/api/listing/get?${searchQuery}&limit=10`);
            const listingData = await listingRes.json();

            if (listingData.length > 8) {
                setShowMoreListings(true);
            }
            if (userData.length > 12) {
                setShowMoreUsers(true);
            }

            setAllListings(listingData);
            setAllUsers(userData);

            setListings(listingData.slice(0, 8));
            setUsers(userData.slice(0, 8));

            setLoading(false);
        }

        fetchListingsAndUsers();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'rent' || e.target.id === 'sublet') {
            setSidebarData({ ...sidebarData, type: e.target.id });
        }
        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished') {
            setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked });
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({ ...sidebarData, sort, order });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();

        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const onShowMoreListings = async () => {
        const numListings = listings.length;
        const startIndex = numListings;
        const additionalListings = allListings.slice(startIndex, startIndex + 8);

        if (additionalListings.length < 9) {
            setShowMoreListings(false);
        }
        setListings([...listings, ...additionalListings]);
    }

    const onShowMoreUsers = async () => {
        const numUsers = users.length;
        const startIndex = numUsers;
        const additionalUsers = allUsers.slice(startIndex, startIndex + 8);

        if (additionalListings.length < 13) {
            setShowMoreUsers(false);
        }
        setUsers([...users, ...additionalUsers]);
    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className="flex">
                <div className="p-7 w-full border-b border-slate-500 
                     md:border-r-2 md:min-h-screen sticky top-0 sm:h-screen 
                     sm:overflow-y-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div className="flex items-center gap-2">
                            <label className="whitespace-nowrap font-semibold">
                                Search Term:
                            </label>
                            <input
                                type="text"
                                id="searchTerm"
                                placeholder="Search"
                                className="border rounded-full p-3 w-full"
                                value={sidebarData.searchTerm}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap items-center">
                            <label className="font-semibold">Type:</label>
                            <div className="flex gap-2">
                                <input
                                    type="checkbox"
                                    id="rent"
                                    className="w-5"
                                    checked={sidebarData.type === 'rent'}
                                    onChange={handleChange}
                                />
                                <span>Rent</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="checkbox"
                                    id="sublet"
                                    className="w-5"
                                    checked={sidebarData.type === 'sublet'}
                                    onChange={handleChange}
                                />
                                <span>Sublease</span>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap items-center">
                            <label className="font-semibold">Amenities:</label>
                            <div className="flex sm:flex-col gap-2">
                                <div className="flex gap-2">
                                    <input
                                        type="checkbox"
                                        id="parking"
                                        className="w-5"
                                        checked={sidebarData.parking}
                                        onChange={handleChange}
                                    />
                                    <span>Parking</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="checkbox"
                                        id="furnished"
                                        className="w-5"
                                        checked={sidebarData.furnished}
                                        onChange={handleChange}
                                    />
                                    <span>Furnished</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="font-semibold">Sort:</label>
                            <select 
                                onChange={handleChange} 
                                defaultValue={'created_at_desc'} 
                                id="sort_order" 
                                className="border rounded-lg p-3">
                                <option value="regularPrice_desc">Price (High to Low)</option>
                                <option value="regularPrice_asc">Price (Low to High)</option>
                                <option value="createdAt_desc">Latest</option>
                                <option value="createdAt_asc">Oldest</option>
                            </select>
                        </div>
                        <button className="bg-slate-700 text-white p-3 
                                rounded-lg hover:opacity-95 uppercase">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className='flex flex-col'>
                <div className='flex-1'>
                    <h1 className='text-3xl font-semibold p-3 text-slate-700 mt-5'>
                        Listings:
                    </h1>
                    <div className='p-7 flex flex-wrap gap-4'>
                        {!loading && listings.length === 0 && (
                            <p className='text-xl text-slate-700'>
                                No listings found
                            </p>
                        )}
                        {loading && (
                            <p className='text-xl text-slate-700 text-center w-full'>
                                Loading
                            </p>
                        )}
                        {!loading && listings && listings.map((listing) => (
                            <ListingResult key={listing._id} listing={listing} />
                        ))}
                        {showMoreListings && (
                            <button onClick={onShowMoreListings}
                                className='text-green-700 hover:underline p-7 
                                text-center w-full'>
                                Show More
                            </button>
                        )}
                    </div>
                </div>
                <div className='flex-1'>
                    <h1 className='text-3xl font-semibold p-3 text-slate-700 mt-5'>
                        Users:
                    </h1>
                    <div className='p-1 sm:p-7 flex flex-wrap gap-2 sm:gap-4'>
                        {loading && (
                            <p className='text-xl text-slate-700'>Loading</p>
                        )}
                        {!loading && users.length === 0 && (
                            <p className='text-xl text-slate-700'>No users found</p>
                        )}
                        {!loading && users && users.map((user) => (
                            <UserCard key={user._id} user={user} className='h-36' />
                        ))}
                        {showMoreUsers && (
                            <button onClick={onShowMoreUsers}
                                className='text-green-700 hover:underline p-7 
                                text-center w-full'>
                                Show More
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
