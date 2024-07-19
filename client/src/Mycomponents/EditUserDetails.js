import React, { useEffect, useRef, useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';


const EditUserDetails = ({ onClose, user }) => {


    const [data, setData] = useState({

        name: user?.user,
        profile_pic: user?.profile_pic,

    })
    const uploadPhotoRef = useRef()
    const dispatch = useDispatch()

    useEffect(() => {
        setData((preve) => {
            return {
                ...preve,
                ...user
            }
        })
    }, [user])


    const handleOnChange = (e) => {
        const { name, value } = e.target


        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const handleOpenUploadPhoto = (e) => {
        e.preventDefault()
        e.stopPropagation()

        uploadPhotoRef.current.click()
    }
    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0]

        const uploadPhoto = await uploadFile(file)


        setData((preve) => {
            return {
                ...preve,
                profile_pic: uploadPhoto?.url
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`
            const response = await axios({
                method: 'post',
                url: URL,
                data: data,
                withCredentials: true
            })

            toast.success(response?.data?.message)

            if (response.data.success) {
                dispatch(setUser(response.data.data))
                onClose()
            }
        }


        catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }




    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center'>
            <div className='w-full max-w-sm bg-white rounded-lg p-5'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl font-bold'>Edit User Details</h1>
                    <button onClick={onClose}><IoCloseOutline size={25} />
                    </button>
                </div>
                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                    {/*  use this for photo in future----->>>>w-16 rounded-full h-16 mt-2 flex justify-center items-center border hover:border-primary cursor-pointer */}
                    <div className='mt-4 flex justify-center items-center'>



                        <div className='my-1 flex items-center gap-4' >
                            <Avatar
                                width={45}
                                height={45}
                                imageUrl={data?.profile_pic}
                                name={data?.name}
                            />
                            <label className='' htmlFor='profile_pic'>
                                <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
                                <input
                                    type='file'
                                    className='hidden'
                                    id='profile_pic'
                                    name='profile_pic'
                                    onChange={handleUploadPhoto}
                                    ref={uploadPhotoRef}
                                />
                            </label>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                            Name :
                        </label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            value={data.name}
                            onChange={handleOnChange}
                            className='shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'

                        />
                    </div>

                    <Divider />
                    <div className='flex justify-end mt-4'>

                        <button className='bg-danger text-white px-4 py-2 rounded-md mr-2' onClick={onClose}>Cancel</button>
                        <button className='bg-primary text-white px-4 py-2 rounded-md' type='
                        submit' onClick={handleSubmit}>Update</button>

                    </div>


                </form>
            </div >
        </div >
    )
}

export default React.memo(EditUserDetails)