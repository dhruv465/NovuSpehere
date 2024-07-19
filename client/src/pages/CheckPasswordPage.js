import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { FaUserAstronaut } from "react-icons/fa";
import Avatar from '../Mycomponents/Avatar';
import { useDispatch } from 'react-redux'
import { setToken, setUser } from '../redux/userSlice'


const CheckPasswordPage = () => {

  const [data, setData] = useState({
    password: "",

  })

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  console.log("location", location.state)

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email')
    }

  },[])

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      })
      toast.success(response.data.message)

      if (response.data.success) {
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token', response?.data?.token)
        //  console.log("data",response)
        setData({
          password: '',

        })
        navigate('/')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)

    }
  }
  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded-xl overflow-hidden p-4 mx-auto'>

        <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
          {/* <FaUserAstronaut
            size={80}
            className='mx-auto w-fit mb-2'
          /> */}
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className='font-semibold text-lg mt-1 '>{location?.state?.name}</h2>
        </div>

        <form className='mt-3 grid gap-4 ' onSubmit={handleSubmit}>


          <div className='mb-3'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
              Password :
            </label>
            <input
              className='shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              name='password'
              placeholder='Enter Your Password'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            className='bg-primary hover:bg-primary-slight text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline tracking-wide'
            type='submit'
          >
            Login
          </button>

        </form>

        <p className='my-3 text-center'><Link to={"/forgot-password"} className='hover:text-primary hover:underline font-semibold'> Forgot password?</Link></p>
      </div>
    </div>
  )
}

export default CheckPasswordPage