import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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
    (error) => {setFileUploadError(true)},
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL) => setFormData({ ...formData, avatar: downloadURL }));
      }
    );
  }

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ?  (<span className='text-red-700'>Could not Upload Image (Must be less than 2MB)</span>) :
            (filePerc > 0 && filePerc < 100) ? (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>) :
            (filePerc === 100) ? (<span className='text-green-700'>Image Successfully Uploaded!</span>) :
            ""
          }
        </p>
        <input type='text' placeholder='User Name' id='username' className='border p-3 rounded-lg' />
        <input type='text' placeholder='Email Address' id='email' className='border p-3 rounded-lg' />
        <input type='text' placeholder='Password' id='password' className='border p-3 rounded-lg' />
        <button className='bg-yellow-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Update Profile</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 hover:cursor-pointer'>Delete Account</span>
        <span className='text-red-700 hover:cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
