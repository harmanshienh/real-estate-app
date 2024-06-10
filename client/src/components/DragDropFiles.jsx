import React, { useRef, useState } from 'react'
import { IoCloudUploadOutline } from "react-icons/io5";

export default function DragDropFiles({ files, setFiles }) {
    const [hovered, setHovered] = useState(false);
    const inputRef = useRef();

    const handleDragOver = (e) => {
        e.preventDefault();
        setHovered(true);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files)
        setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
        setHovered(false);
    }

    const handleChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }

    return (
        <div
            onClick={() => inputRef.current.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className='flex flex-col w-full sm:w-[330px] h-64 justify-center 
                       items-center border-2 border-dashed border-red-500 
                       rounded-lg hover:cursor-pointer hover:opacity-75'>
            {(files.length === 0 || hovered) && (
                <>
                    <IoCloudUploadOutline className='text-red-500 h-28 w-auto' />
                    <h1 className=' text-red-500 p-1'>
                        Drag and Drop Files to Upload
                    </h1>
                    <h1 className=' text-red-500 p-1'>
                        Or Select Files
                    </h1>
                    <input
                        onChange={handleChange}
                        type='file'
                        id='images'
                        accept='image/*'
                        multiple
                        hidden
                        ref={inputRef} />
                </>
            )}
            {files.length > 0 && !hovered && (
                <ul className='ml-3'>
                    {Array.from(files).map((file, index) =>
                        <li
                            className='line-clamp-1 text-red-700 font-semibold'
                            key={index}>
                            {file.name}
                        </li>
                    )}
                </ul>
            )}
        </div>
    )
}
