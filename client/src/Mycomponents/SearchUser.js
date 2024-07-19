import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import Loading from './Loader';
import SearchUserCard from './SearchUserCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoCloseOutline } from "react-icons/io5";

const SearchUser = ({ onClose }) => {
    const [searchUser, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    const handleSearchUser = async () => {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`

        try {
            setLoading(true)
            const response = await axios.post(URL, {
                search: search
            })
            setLoading(false)

            setSearchUser(response.data.data)
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    useEffect(() => {
        handleSearchUser()
    }, [search])
    console.log("searchUser", searchUser)
    return (
        <div>
            <div className='fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50 p-2 z-10'>
                <div className='w-full max-w-lg mx-auto mt-10 bg-white rounded-lg p-4 flex'>
                    <input onChange={(e) => setSearch(e.target.value)} value={search} type='text' placeholder='Search user by name or email....' className='w-full h-12 border border-slate-200 rounded-lg p-2 focus:outline-none' />

                    <div className='h-12 w-14 flex justify-center items-center cursor-pointer'>
                        <IoSearch
                            size={25}
                        />
                    </div>

                </div>
                <div className='w-full max-w-lg mx-auto bg-white rounded-lg mt-2 p-4 overflow-x-hidden overflow-y-auto scrollbar'>
                    {
                        searchUser.length === 0 && !loading && (
                            <p className='text-center text-slate-400'>
                                No user found!!
                            </p>
                        )

                    }
                    {
                        loading && (
                            <Loading />
                        )
                    }

                    {
                        searchUser.length > 0 && (
                            searchUser.map((user, index) => {
                                return (
                                    <SearchUserCard key={user._id} user={user} onClose={onClose} />
                                )
                            })
                        )
                    }

                </div>
                <div className='absolute top-0 right-0 text-2xl p-2 lg:p-4 lg:text-4xl hover:text-white z-10'>
                    <button>
                        <IoCloseOutline onClick={onClose} />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default SearchUser