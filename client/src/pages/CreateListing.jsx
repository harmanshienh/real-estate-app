import React from 'react'
import { useState } from 'react'
import { 
    getDownloadURL, 
    getStorage, 
    ref, 
    uploadBytesResumable 
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DragDropFiles from '../components/DragDropFiles';
import { TiDeleteOutline } from "react-icons/ti";
import RichTextEditor from '../components/RichTextEditor';

export default function CreateListing() {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageURLs: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        parking: false,
        furnished: false
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageURLs: formData.imageURLs.concat(urls) });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                setImageUploadError('Image Upload Failed (Max 2MB per image)');
                setUploading(false);
            });
            setFiles([]);
        }
        else {
            setImageUploadError('Please upload no more than 6 Images per listing');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData, 
            imageURLs: formData.imageURLs.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'sublet' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    };

    const handleQuillChange = (value) => {
        setFormData({...formData, description: value});
    } 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageURLs.length < 2) {
                return setError('You must upload at least 2 images');
            }
            setSubmitLoading(true);
            setError(false);

            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            });

            const data = await res.json();
            setSubmitLoading(false);

            if (data.success === false) {
                setError(data.message);
            }

            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setSubmitLoading(false); 
            console.log(error);
        }
    }

    const extractFileNameFromURL = (url) => {
        const URLWithoutFirebase = url.substring(url.lastIndexOf('/') + 1);
        const URLWithoutDate = URLWithoutFirebase.slice(13);
        const endIndex = URLWithoutDate.lastIndexOf('?');
        const filename = URLWithoutDate.substring(0, endIndex);
        return filename;
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Create a Listing
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input 
                        type='text' 
                        placeholder='Name' 
                        className='border p-3 rounded-lg' 
                        id='name' 
                        maxLength='62' 
                        minLength='10' 
                        required 
                        onChange={handleChange} 
                        value={formData.name} />
                    <RichTextEditor 
                        value={formData.description} 
                        onChange={handleQuillChange}  />
                    <input 
                        type='text' 
                        placeholder='Address' 
                        className='border p-3 rounded-lg' 
                        id='address' 
                        required 
                        onChange={handleChange} 
                        value={formData.address} />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' 
                                id='sublet' 
                                className='w-5' 
                                onChange={handleChange} 
                                checked={formData.type === 'sublet'} />
                            <span>Sublease</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' 
                                id='rent' 
                                className='w-5' 
                                onChange={handleChange} 
                                checked={formData.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' 
                                id='parking' 
                                className='w-5' 
                                onChange={handleChange} 
                                checked={formData.parking} />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' 
                                id='furnished' 
                                className='w-5' 
                                onChange={handleChange} 
                                checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex items-center gap-2'>
                            <input 
                                type='number' 
                                id='bedrooms' 
                                min='1' 
                                max='10' 
                                required 
                                className='p-3 border border-gray-300 rounded-lg' 
                                onChange={handleChange} 
                                value={formData.bedrooms} />
                            <span>Beds</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input 
                                type='number' 
                                id='bathrooms' 
                                min='1' 
                                max='10' 
                                required 
                                className='p-3 border border-gray-300 rounded-lg' 
                                onChange={handleChange} 
                                value={formData.bathrooms} />
                            <span>Baths</span>
                        </div>
                        <div className='flex items-center gap-2 w-full'>
                            <input 
                                type='number' 
                                id='regularPrice' 
                                min='1' 
                                max='10000000' 
                                required 
                                className='p-3 border border-gray-300 
                                           rounded-lg max-w-25' 
                                onChange={handleChange} 
                                value={formData.regularPrice} />
                            <div className='flex flex-col items-center'>
                                <span>Price</span>
                                <span className='text-xs'>$ / month</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <span className='font-semibold'>
                        Images:
                        <span className='font-normal text-gray-600 ml-2'>
                            The first image will be the cover (Max 6)
                        </span>
                    </span>
                    <div className='sm:flex gap-4 max-w-full'>
                        <DragDropFiles files={files} setFiles={setFiles} />
                        <button 
                            type='button' 
                            onClick={handleImageSubmit} 
                            disabled={uploading} 
                            className='mt-3 sm:mt-0 p-3 max-h-16 text-green-700 
                                       font-semibold border border-green-700 
                                       rounded-lg uppercase hover:shadow-lg
                                       hover:text-white hover:bg-green-700 
                                       disabled:opacity-80'>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className='text-sm self-center'>
                        {imageUploadError &&  (
                            <span className='text-red-700 text-sm'>
                                {imageUploadError}
                            </span>)}
                    </p>
                    {
                        formData.imageURLs.length > 0 && 
                        formData.imageURLs.map((url, index) => (
                            <div key={url} 
                                 className='flex justify-between p-3 border 
                                            items-center bg-slate-100'>
                                <img 
                                    src={url} 
                                    alt='listing image' 
                                    className='w-20 h-20 object-contain rounded-lg' />
                                <span className='line-clamp-2 px-3'>
                                    {extractFileNameFromURL(url)}
                                </span>
                                <button 
                                    type='button' 
                                    onClick={() => handleRemoveImage(index)} 
                                    className='p-3 hover:opacity-75'>
                                    <TiDeleteOutline className='text-red-700 h-6 w-auto' />
                                </button>
                            </div>
                        ))
                    }
                    <button 
                        disabled={submitLoading || uploading} 
                        className='p-3 bg-slate-700 text-white rounded-lg 
                                   uppercase hover:opacity-95 disabled:opacity-80'>
                        {submitLoading ? 'Creating...' : 'Create Listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </main>
    )
}