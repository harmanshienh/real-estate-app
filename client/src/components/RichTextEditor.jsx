import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css'

export default function RichTextEditor({ value, onChange }) {
    const toolbarOptions = [
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }]
      ];
    const modules = {
        toolbar: toolbarOptions
    }

    const handleQuillChange = (value) => {
        setFormData({ ...formData, description: value });
    };


  return (
    <ReactQuill 
        className='bg-white rounded-lg border-none' 
        placeholder='Description'
        modules={modules}
        theme='snow' 
        value={value} 
        onChange={onChange} />
  )
}
