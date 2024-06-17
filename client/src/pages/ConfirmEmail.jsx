import React from 'react'
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";

export default function ConfirmEmail() {
    const [validUrl, setValidUrl] = useState(false);
    const { emailToken } = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const res = await fetch(`/api/auth/confirmation/${emailToken}`);
                if (res.ok) {
                    setValidUrl(true);
                }
            } catch (error) {
                console.log(error);
                setValidUrl(false);
            }
        };
        verifyEmailUrl();
    }, [emailToken]);

    return (
        <>
            {validUrl ? (
                <div className='flex flex-col gap-6 items-center justify-center pt-10'>
                    <FaRegCheckCircle className='w-1/2 sm:w-1/5 h-auto text-green-600' />
                    <h1 className="text-green-600 text-3xl">
                        Email verified successfully!
                    </h1>
                    <Link to="/sign-in" className='p-3 border border-green-700 rounded-lg group hover:bg-green-700'>
                        <span className='text-green-700 text-xl uppercase group-hover:text-white'>
                            Sign In
                        </span>
                    </Link>
                </div>
            ) : (
                <h1>404 Not Found</h1>
            )}
        </>
    );
}
