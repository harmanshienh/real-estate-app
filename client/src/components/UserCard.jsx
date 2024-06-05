import React from 'react'
import { Link } from 'react-router-dom'

export default function UserCard({ name, profilePicture, userCreated, linkTo }) {
    return (
        <Link to={linkTo} className='contents'>
            <div className='relative group flex flex-col sm:flex-row border rounded-lg justify-center items-center border-red-900 overflow-hidden hover:cursor-pointer'>
                <div className='flex sm:w-24 sm:h-24 items-center p-3 sm:justify-center overflow-hidden group-hover:h-full'>
                    <img
                        src={profilePicture}
                        className='h-24 w-24 self-center rounded-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-150 group-hover:rounded-lg'
                    />
                </div>
                <div className='flex flex-col my-auto gap-2 max-sm:hidden'>
                    <span className='font-semibold px-3 text-lg'>{name}</span>
                    <div className='flex whitespace-nowrap'>
                        <p className='font text-xs px-3 sm:pb-3'>
                            User since {new Date(userCreated).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}