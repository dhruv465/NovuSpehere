import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoChevronBack, IoSearch } from "react-icons/io5";
import Loading from './Loader';
import SearchUserCard from './SearchUserCard';

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
            <div className='fixed top-2 left-0 bottom-0 right-0 bg-white bg-opacity-100 p-2 z-10'>
                <div className='absolute top-0  left-0 text-2xl text-primary p-2 lg:p-4 lg:text-2xl mr-4'>
                    <button>
                        <IoChevronBack onClick={onClose} />
                    </button>
                </div>
                <div className='bg-secondary  font-noto-sans p-[0.5px] rounded-lg mx-8'>
                    <div className='flex justify-center items-center pl-2 text-slate-400'>
                        <IoSearch
                            size={22}
                        />
                        <input
                            type="text"
                            onChange={(e) => setSearch(e.target.value)} value={search}
                            placeholder='Search'
                            className='w-full p-2 bg-transparent focus:outline-none text-slate-800'
                            autoFocus // Add this line to autofocus the input
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

            </div>

        </div>
    )
}

export default SearchUser