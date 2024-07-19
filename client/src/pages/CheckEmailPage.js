import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { FaUserAstronaut } from "react-icons/fa";


const CheckEmailPage = () => {

  const [data, setData] = useState({

    email: '',

  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
      const response = await axios.post(URL, data)

      toast.success(response.data.message)

      if (response.data.success) {
        setData({
          email: '',

        })
        navigate('/password',{
          state: response?.data?.data
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)

    }
  }
  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded-xl overflow-hidden p-4 mx-auto'>

        <div>
        <FaUserAstronaut 
        size={80}
        className='mx-auto w-fit mb-2'
        />
        </div>
        <h3>Welcome to Chat app!</h3>

        <form className='mt-3 grid gap-4 ' onSubmit={handleSubmit}>


          <div className='mb-3'>
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

          <button
            className='bg-primary hover:bg-primary-slight text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline tracking-wide'
            type='submit'
          >
            Let's Go
          </button>

        </form>

        <p className='my-3 text-center'>New User ? <Link to={"/register"} className='hover:text-primary hover:underline font-semibold'> Register</Link></p>
      </div>
    </div>
  )
}

export default CheckEmailPage