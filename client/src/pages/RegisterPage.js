import React, { useState } from 'react'
import { RiDeleteBinLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';


const RegisterPage = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: ''
  })
  const [uploadPhoto, setuploadPhoto] = useState("")
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)

    setuploadPhoto(file)
    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url
      }
    })
  }




  const handleClearUploadPhoto = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setuploadPhoto(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

    try {
      const response = await axios.post(URL, data)
      console.log("response", response)

      toast.success(response.data.message)

      if (response.data.success) {
        setData({
          name: '',
          email: '',
          password: '',
          profile_pic: ''
        })
        navigate('/email')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)

    }

    console.log("data", data)
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded-xl overflow-hidden p-4 mx-auto'>
        <h3>Welcome to Chat app!</h3>

        <form className='mt-4 grid gap-4 ' onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
              Name :
            </label>
            <input
              className='shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type='text'
              id='name'
              name='name'
              placeholder='Enter Your Name'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
              Email :
            </label>
            <input
              className='shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='email'
              type='email'
              name='email'
              placeholder='Enter Your email'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
              Password :
            </label>
            <input
              className='shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              name='password'
              placeholder='Enter Your password'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='profile_pic'>
              Photo :


              <div className='h-14 mt-2 bg-slate-200 flex justify-center items-center border hover:border-primary rounded-md cursor-pointer'>
                <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                  {
                    uploadPhoto ? uploadPhoto.name : 'Upload profile photo'
                  }

                </p>
                {
                  uploadPhoto?.name && (
                    <button className='text-lg ml-2 hover:text-red-500' onClick={handleClearUploadPhoto}>
                      <RiDeleteBinLine />
                    </button>
                  )
                }

              </div>
            </label>
            <input
              className='shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline hidden'
              id='profile_pic'
              type='file'
              name='profile_pic'
              onChange={handleUploadPhoto}

            />
          </div>

          <button
            className='bg-primary hover:bg-primary-slight text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline tracking-wide'
            type='submit'
          >
            Register
          </button>

        </form>

        <p className='my-3 text-center'>Already have account ? <Link to={"/email"} className='hover:text-primary hover:underline font-semibold'> Login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage