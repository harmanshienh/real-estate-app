import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingResult from '../components/listingResult';

export default function Search() {
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'rent',
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
                type: urlType || 'rent',
                parking: urlParking === 'true' ? true : false,
                furnished: urlFurnished === 'true' ? true : false,
                sort: urlSort || 'created_at',
                order: urlOrder || 'desc'
            })
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);

            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 9) {
                setShowMore(true);
            }
            setListings(data);
            setLoading(false);
        }
        fetchListings();
    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData({...sidebarData, type: e.target.id});
        }
        if (e.target.id === 'searchTerm') {
            setSidebarData({...sidebarData, searchTerm: e.target.value});
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished') {
            setSidebarData({...sidebarData, [e.target.id]: (e.target.checked || e.target.checked === 'true') ? true : false});
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({...sidebarData, sort, order});
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

    const onShowMoreClick = async () => {
        const numListings = listings.length;
        const urlParams = new URLSearchParams(location.search);
        const startIndex = numListings;
        urlParams.set('startIndex', startIndex);

        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 10) {
            setShowMore(false);
        }
        else {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-1 border-slate-500 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input 
                        type='text' 
                        id='searchTerm' 
                        placeholder='Search'
                        className='border rounded-lg p-3 w-full'
                        value={sidebarData.searchTerm}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' 
                            id='rent'
                            className='w-5'
                            checked={sidebarData.type === 'rent'}
                            onChange={handleChange}
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' 
                            id='sale'
                            className='w-5'
                            checked={sidebarData.type === 'sale'}
                            onChange={handleChange}
                        />
                        <span>Sale</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' 
                            id='parking'
                            className='w-5'
                            checked={sidebarData.parking}
                            onChange={handleChange}
                        />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' 
                            id='furnished'
                            className='w-5'
                            checked={sidebarData.furnished}
                            onChange={handleChange}
                        />
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select onChange={handleChange} defaultValue={'created_at_desc'} id='sort_order' className='border rounded-lg p-3 '>
                        <option value='regularPrice_desc'>Price (High to Low)</option>
                        <option value='regularPrice_asc'>Price (Low to High)</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>
                <button 
                className='bg-slate-700 text-white p-3 rounded-lg 
                            hover:opacity-95 uppercase'>Search</button>
            </form>
        </div>
        <div className='flex-1'>
            <h1 className='text-3xl font-semibold p-3 text-slate-700 mt-5'>
                Listing Results:
            </h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {!loading && listings.length === 0 && (
                    <p className='text-xl text-slate-700'>No listings found</p>
                )}
                {loading && (
                    <p className='text-xl text-slate-700 text-center w-full'>Loading</p>
                )}
                {!loading && listings && listings.map((listing) => (
                    <ListingResult key={listing._id} listing={listing} />
                ))}
                {showMore && (
                    <button onClick={onShowMoreClick} 
                    className='text-green-700 hover:underline p-7 text-center w-full'>
                        Show More
                    </button>
                )}
            </div>
        </div>
    </div>
  )
}
