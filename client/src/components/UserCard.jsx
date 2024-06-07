import React from 'react'
import { Link } from 'react-router-dom'

export default function UserCard({ user }) {
    if (!user) {
        return <div>Loading...</div>
    }
    return (
        <Link to={`/user/${user._id}`} className='contents'>
            <div className='bg-slate-100 shadow-md hover:shadow-lg transition-shadow relative group flex flex-col sm:flex-row border rounded-lg justify-center items-center border-red-900 overflow-hidden hover:cursor-pointer'>
                <div className='flex sm:w-24 sm:h-24 items-center p-3 sm:justify-center overflow-hidden group-hover:h-full'>
                    <img
                        src={user.avatar}
                        className='h-24 w-24 self-center rounded-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-150 group-hover:rounded-lg'
                    />
                </div>
                <div className='flex flex-col my-auto gap-2 max-sm:hidden'>
                    <span className='font-semibold px-3 text-lg'>{user.username}</span>
                    <div className='flex whitespace-nowrap'>
                        <p className='font text-xs px-3 sm:pb-3'>
                            User since {new Date(user.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}