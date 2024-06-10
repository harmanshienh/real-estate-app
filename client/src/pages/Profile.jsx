import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react';
import { 
  getDownloadURL, 
  getStorage, 
  ref, 
  uploadBytesResumable 
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  signOutUserStart, signOutUserSuccess, signOutUserFailure
} from '../redux/user/userSlice';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([])
  const [showPassword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);


  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100)
        setFilePerc(Math.round(progress));
      },
      (error) => { setFileUploadError(true) },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => setFormData({ ...formData, avatar: downloadURL }));
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleDeleteUser = async () => {
    try {
      dispatch(signOutUserStart());
      console.log(currentUser._id);

      const listingRes = await fetch(`/api/user/listings/${currentUser._id}`);
      const listingData = await listingRes.json();
      console.log(listingData);

      if (listingData.success === false) {
        dispatch(signOutUserFailure(listingData.message));
        return;
      }

      for (const listing of listingData) {
        console.log(listing._id);
        const deleteListingRes = await fetch(`/api/listing/delete/${listing._id}`, {
          method: 'DELETE'
        });
        const deleteListingData = await deleteListingRes.json();
        if (deleteListingData.success === false) {
          dispatch(signOutUserFailure(deleteListingData.message));
          return;
        }
      }

      const userRes = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });
      const userData = await userRes.json();

      if (userData.success === false) {
        dispatch(signOutUserFailure(userData.message));
        return;
      }

      dispatch(signOutUserSuccess(userData));
      setShowDelete(false);
      navigate('/sign-in');

    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  }

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

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className={`relative ${showDelete && 'h-screen overflow-hidden'}`}>
      {showDelete && (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm'></div>
      )}
      <div className='absolute'>
        {showDelete && (
          <div className='fixed flex flex-col bg-slate-100 rounded-lg w-full 
               sm:w-fit h-100 mt-3 top-1/2 left-1/2 transform 
               -translate-x-1/2 -translate-y-1/2 z-50'>
            <span className='self-center font-bold mx-auto p-3'>
              Are you sure you want to delete your account?
              <br /> This will delete all your listings.
            </span>
            <div className='flex justify-between bg-slate-100 rounded-lg'>
              <button 
                className='bg-red-500 rounded-md text-white p-3 m-3' 
                onClick={() => setShowDelete(false)}>
                Cancel
              </button>
              <button 
                className=' bg-red-500 rounded-md text-white p-3 m-3' 
                onClick={handleDeleteUser}>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={`p-3 max-w-lg mx-auto ${showDelete ? 'blur-sm' : ''}`}>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input 
            onChange={(e) => setFile(e.target.files[0])} 
            type='file' 
            ref={fileRef} 
            hidden 
            accept='image/*' 
            disabled={showDelete} />
          <div className='relative group self-center w-24 h-24 rounded-lg'>
            <img 
              onClick={() => fileRef.current.click()} 
              src={formData.avatar || currentUser.avatar} 
              alt='profile' 
              className={`rounded-full h-full w-full object-cover 
              ${!showDelete && 'cursor-pointer'} self-center`} />
            {!showDelete && (
              <div className="flex justify-center absolute bottom-0 left-1/2 
                   transform -translate-x-1/2 bg-black w-24 h-12 opacity-0 
                   group-hover:opacity-80 transition-opacity duration-300 
                   rounded-b-full">
                <span className='text-white text-xs mt-2'>Update Image</span>
              </div>
            )}
          </div>
          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>
                Could not Upload Image (Must be less than 2MB)
              </span>) :
              (filePerc > 0 && filePerc < 100) ? (
                <span className='text-slate-700'>
                  {`Uploading ${filePerc}%`}
                </span>) :
                (filePerc === 100) ? (
                <span className='text-green-700'>
                  Image Successfully Uploaded!
                </span>) : ""
            }
          </p>
          <input
            type='text'
            placeholder='User Name'
            defaultValue={currentUser.username}
            id='username'
            className='border p-3 rounded-lg'
            onChange={handleChange}
            disabled={showDelete}
          />
          <input
            type='text'
            placeholder='Email Address'
            id='email'
            defaultValue={currentUser.email}
            className='border p-3 rounded-lg'
            onChange={handleChange}
            disabled={showDelete}
          />
          <div className='relative group'>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder='Password' 
              className='border p-3 rounded-lg w-full' 
              id='password' 
              onChange={handleChange} 
              disabled={showDelete} />
            <div 
              onClick={!showDelete ? () => (setShowPassword(!showPassword)) : () => {}} 
              className='absolute right-3 top-1/3'>
              {showPassword ?
                <FaEyeSlash className={`text-xl text-slate-600 
                            ${!showDelete && 'cursor-pointer'}`} /> :
                <FaEye className={`text-xl text-slate-600 
                            ${!showDelete && 'cursor-pointer'}`} />
              }
            </div>
          </div>
          {!showDelete && (
            <button 
              disabled={loading} 
              className='bg-yellow-500 text-white p-3 rounded-lg uppercase 
              hover:opacity-95 disabled:opacity-80 z-10'>
                {loading ? 'Loading...' : 'Update Profile'}
            </button>
          )}
        </form>
        {!showDelete && (
          <div className='flex justify-between mt-5'>
            <p 
              onClick={() => setShowDelete(true)} 
              className='text-red-700 hover:cursor-pointer'>
                Delete Account
            </p>
            <Link 
              to="/sign-in" 
              onClick={handleSignOut} 
              className='text-red-700 hover:cursor-pointer'>
                Sign Out
            </Link>
          </div>
        )}
        <p className='text-red-700 mt-5'>
          {error ? error : ''}
        </p>
        <p className='text-green-700 mt-5'>
          {updateSuccess ? 'User updated successfully!' : ''}
        </p>
        <button 
          onClick={handleShowListings} 
          className='text-green-700 w-full'>
            Show Listings
        </button>
        <span className='text-red-700 mt-5'>
          {showListingsError && 'Error showing listings'}
        </span>
  
        {(userListings && userListings.length > 0) &&
          <div className='flex flex-col gap-4'>
            <h1 className='text-center mt-7 text-2xl font-semibold'>
              Your Listings
            </h1>
            {userListings.map((listing) => (
              <div 
                key={listing._id} 
                className='border rounded-lg p-3 flex justify-between 
                items-center gap-4 bg-slate-100'>
                <Link 
                  to={`/listing/${listing._id}`} 
                  className='text-slate-700 font-semibold hover:underline 
                  truncate flex-1'>
                  <img 
                    src={listing.imageURLs[0]} 
                    alt='listing cover' 
                    className='h-16 w-16 object-contain' />
                  <span>{listing.name}</span>
                </Link>
                <div className='flex flex-col items-center'>
                  <button 
                    onClick={() => handleDeleteListing(listing._id)} 
                    className='text-red-700 uppercase'>
                      Delete
                  </button>
                  <Link
                    to={`/update-listing/${listing._id}`} 
                    className='text-green-700 uppercase'>
                      Update
                  </Link>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </main>
  )
  
}