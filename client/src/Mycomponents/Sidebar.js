import React, { useEffect, useState } from 'react';
import { BsPeople, BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import { IoImages, IoSearch, IoVideocam } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import Avatar from '../Mycomponents/Avatar';
import { logout } from '../redux/userSlice';
import EditUserDetails from './EditUserDetails';
import SearchUser from './SearchUser';


const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [allUser, setAllUser] = useState([])
    const [openSearchUser, setOpenSearchUser] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('sidebar', user._id)

            socketConnection.on('conversation', (data) => {
                console.log('conversation', data)

                const conversationUserData = data.map((conversationUser) => {

                    if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.sender
                        }
                    }
                    else if (conversationUser?.receiver?._id !== user?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.receiver
                        }
                    }
                    else {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.sender
                        }
                    }

                })

                setAllUser(conversationUserData)
            })

            return () => {
                socketConnection.off('conversation')
            }
        }
    }, [socketConnection, user])


    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const [isDarkMode] = useState(document.body.classList.contains('dark'));


    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);



    const handleLogout = () => {
        dispatch(logout())
        navigate("/email")
        localStorage.clear()
    }

    return (
        <div className='w-full h-full backdrop-filter backdrop-blur-sm bg-white border-l-0 border-r  '>


            <div className='w-full col-start-2'>
                <div className='h-16 flex items-center justify-between pr-4 bg-transparent'>
                    <h2 className='text-2xl font-bold pl-4 text-black font-noto-sans'>
                        Messages
                    </h2>

                    <div className='flex items-center mr-4 space-x-4'>
                        <button
                            className='p-2 rounded-full text-primary'
                            title='Menu'
                            onClick={toggleModal}
                        >
                            <HiOutlineDotsCircleHorizontal size={25} />
                        </button>
                        <button
                            className='rounded-full p-2 text-primary'

                            onClick={() => {

                                setOpenSearchUser(true)
                            }}
                        >
                            <span>
                                <FiEdit size={20} />
                            </span>

                        </button>
                    </div>


                </div>

                <div className='bg-secondary   font-noto-sans p-[0.5px] mb-4 rounded-lg mx-4 '>
                    <div className='flex  justify-center items-center pl-2 text-slate-400'>
                        <IoSearch
                            size={22}
                        />
                        <input
                            type="text" 
                            onClick={() => {
                                setOpenSearchUser(true)
                            }}
                            placeholder='Search'
                            className='w-full p-2 bg-transparent focus:outline-none text-slate-800'
                        />
                    </div>
                </div>
                <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar '>
                    {
                        allUser.length === 0 && (
                            <div className='drop-shadow-lg'>
                                <div className='flex justify-center items-center my-4 text-slate-500'>
                                    <BsPeople size={50} />
                                </div>
                                <p className='text-lg text-center text-slate-400'>Find your friends to chat with them.</p>
                            </div>
                        )
                    }

                    {
                        allUser.map((conv) => {
                            return (
                                <NavLink to={"/" + conv?.userDetails?._id} key={conv?._id}>
                                    <div className='flex items-center p-4 hover:bg-secondary border-b cursor-pointer '>
                                        <div>
                                            <Avatar width={40} height={40} imageUrl={conv?.userDetails?.profile_pic} name={conv?.userDetails?.name} />
                                        </div>
                                        <div className='ml-4'>
                                            <h2 className='text-lg font-semibold text-slate-800'>{conv?.userDetails?.name}</h2>
                                            <div>
                                                <div className='text-slate-500 text-md '>
                                                    {
                                                        conv?.lastMsg?.imageUrl && (
                                                            <div className='flex items-center gap-2'>
                                                                <span>
                                                                    <IoImages />
                                                                </span>
                                                                {
                                                                    !conv?.lastMsg?.text && (
                                                                        <span>
                                                                            Image.
                                                                        </span>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        conv?.lastMsg?.videoUrl && (
                                                            <div className='flex items-center gap-2'>
                                                                <span>
                                                                    <IoVideocam />
                                                                </span>
                                                                {
                                                                    !conv?.lastMsg?.text && (
                                                                        <span>
                                                                            Video.
                                                                        </span>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        conv?.lastMsg?.documentUrl && (
                                                            <div className='flex items-center gap-2'>
                                                                <span>
                                                                    <IoImages />
                                                                </span>
                                                                {
                                                                    !conv?.lastMsg?.text && (
                                                                        <span>
                                                                            Document.
                                                                        </span>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                                <p className='text-ellipsis line-clamp-1 gap-4'>{conv?.lastMsg?.text}</p>
                                            </div>
                                        </div>
                                        {
                                            Boolean(conv?.unseenMsg) && (
                                                <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>
                                                    {conv?.unseenMsg}
                                                </p>
                                            )
                                        }
                                    </div>
                                </NavLink>
                            )
                        })
                    }
                </div>
            </div>

            {/* Open Menu */}
            {isModalOpen && (
                <div className='absolute top-14 right-8 w-48 backdrop-filter backdrop-blur-lg p-3 shadow rounded-lg'>

                    <div className='w-full h-full'>
                        <button
                            className='w-full flex items-center gap-2 p-2 hover:bg-secondary rounded-md'
                            onClick={() => {
                                toggleModal()
                                setEditUserOpen(true)
                            }}
                        >
                            <span>
                                <BsThreeDotsVertical size={20} />
                            </span>
                            <span>
                                Edit profile
                            </span>
                        </button>
                        <button
                            className='w-full flex items-center gap-2 p-2 hover:bg-secondary rounded-md'
                            onClick={handleLogout}
                        >
                            <span>
                                <TbLogout2 size={20} />
                            </span>
                            <span>
                                Logout
                            </span>
                        </button>

                    </div>

                </div>
            )}

            {/* Edit profile details */}
            {
                editUserOpen && (
                    <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
                )
            }

            {/* Open search bar */}
            {
                openSearchUser && (
                    <SearchUser onClose={() => { setOpenSearchUser(false) }} />
                )
            }
        </div>
    )
}

export default Sidebar
