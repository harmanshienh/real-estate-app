import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Header.css'

export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            setShowHeader(false);
        }
        else {
            setShowHeader(true);
        }

        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const urlSearchTerm = urlParams.get('searchTerm');
        if (urlSearchTerm) {
            setSearchTerm(urlSearchTerm);
        }
    }, [location.search])

    return (
        <header className={`sticky top-0 z-50 w-full bg-yellow-500 shadow-md 
                            transition-transform duration-300 
                            ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500 mr-2'>Waterloo</span>
                        <span className='text-slate-700'>Student Housing</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} 
                      className='bg-slate-100 group p-3 
                      rounded-full  flex items-center gap-2 border-2 border-yellow-500 
                      focus-within:border-2 focus-within:border-red-500 max-sm:hidden'>
                    <button>
                        <FaSearch className='text-slate-600 
                                group-focus-within:text-red-500' />
                    </button>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type='text'
                        placeholder='Search'
                        className='bg-transparent focus:outline-none 
                        hide-placeholder hidden sm:w-64 sm:block' />
                </form>
                <ul className='flex gap-4 items-center'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-slate-700 
                            hover:underline cursor-pointer'>
                            Home
                        </li>
                    </Link>
                    {currentUser ? <Link to='/create-listing'>
                        <li className="bg-red-700 text-white p-2 rounded-lg 
                            font-semibold text-center hover:opacity-95">
                            <span className="block sm:hidden">Create</span>
                            <span className="hidden sm:block">Create Listing</span>
                        </li>
                    </Link> : ""}
                    <Link to='/profile'>
                        {currentUser ? (
                            <img 
                                className='rounded-full h-7 w-7 object-cover' 
                                src={currentUser.avatar} 
                                alt='Profile' /> ) :
                            <Link to="/sign-in">
                                <li className=" text-slate-700 hover:underline">
                                    Sign in
                                </li>
                            </Link>}
                    </Link>
                </ul>
            </div>
        </header >
    )
}
