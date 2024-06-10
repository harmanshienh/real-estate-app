import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
        setLoading(false);
        setError(error.message);
    }
  
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          type='text' 
          placeholder='Username' 
          className='border p-3 rounded-lg' 
          id='username' 
          onChange={handleChange} />
        <input 
          type='email' 
          placeholder='Email Address' 
          className='border p-3 rounded-lg' 
          id='email' 
          onChange={handleChange} />
        <div className='relative group'>
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder='Password' 
            className='border p-3 rounded-lg w-full' 
            id='password' 
            onChange={handleChange} />
          <div 
            onClick={() => (setShowPassword(!showPassword))} 
            className='absolute right-3 top-1/3'>
            {showPassword ?
              <FaEyeSlash className='text-xl
           text-slate-600 cursor-pointer'/> :
              <FaEye className='text-xl
          text-slate-600 cursor-pointer'/>
            }
          </div>
        </div>
        <button 
          disabled={loading} 
          className='bg-yellow-500 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}