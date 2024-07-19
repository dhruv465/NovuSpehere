import React, { useEffect, useState } from 'react'
import { IoChatbox, IoChatboxOutline, IoImages, IoMoonSharp, IoSunnySharp, IoVideocam } from "react-icons/io5";
import { TbUserPlus } from "react-icons/tb";
import { NavLink, useNavigate } from 'react-router-dom';
import { TbLogout2 } from "react-icons/tb";
import Avatar from '../Mycomponents/Avatar'
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import { IoArrowUndoSharp } from "react-icons/io5";
import SearchUser from './SearchUser';
import { logout } from '../redux/userSlice';
import { HiOutlineDotsVertical } from 'react-icons/hi';

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

                const conversationUserData = data.map((conversationUser, index) => {

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

    const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark'));

    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            document.body.classList.toggle('dark', newMode);
            return newMode;
        });
    };

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
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white drop-shadow-2xl'>
            <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
                <div>
                    <NavLink className={({ isActive }) => `w-10 h-10 m-1 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full ${isActive && "bg-slate-200"}`} title='chat'>
                        <IoChatbox size={20} />
                    </NavLink>
                    <div onClick={() => { setOpenSearchUser(true) }} className='w-10 h-10 m-1 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full' title='add friend'>
                        <TbUserPlus size={20} />
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    <button className='mx-auto' title={user?.name} onClick={() => setEditUserOpen(true)}>
                        <Avatar width={40} height={40} name={user?.name} imageUrl={user.profile_pic} userId={user?._id} />
                    </button>
                    <button className='w-10 h-10 m-1 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full' title='logout' onClick={handleLogout}>
                        <span className='-ml-2'>
                            <TbLogout2 size={20} />
                        </span>
                    </button>
                </div>
            </div>

            <div className='w-full'>
                <div className='h-16 flex items-center justify-between'>
                    <h2 className='text-xl font-bold p-4 text-slate-800'>
                        Chats
                    </h2>
                    <div className='flex items-center mr-4' >
                        <button
                            className='p-2 rounded-full hover:bg-slate-300'
                            title='Menu'
                            onClick={toggleModal}
                        >
                            <HiOutlineDotsVertical size={25} />
                        </button>
                    </div>
                </div>

                <div className='bg-slate-200 p-[0.5px] rounded-lg'>
                    {/* <Divider /> */}
                </div>
                <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {
                        allUser.length === 0 && (
                            <div>
                                <div className='flex justify-center items-center my-4 text-slate-500'>
                                    <IoArrowUndoSharp size={50} />
                                </div>
                                <p className='text-lg text-center text-slate-400'>Find your friends to chat with them.</p>
                            </div>
                        )
                    }

                    {
                        allUser.map((conv, index) => {
                            return (
                                <NavLink to={"/" + conv?.userDetails?._id} key={conv?._id}>
                                    <div className='flex items-center p-4 hover:bg-slate-50 border-b border-slate-100 cursor-pointer rounded-md'>
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
                                                <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-secondary text-white font-semibold rounded-full'>
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
                <div className='absolute top-14 right-8 w-48 bg-slate-200 p-3 shadow rounded-lg'>
                    <div className='w-full h-full'>
                        <button
                            className='w-full flex items-center gap-2 p-2 hover:bg-slate-300  rounded-md'
                            onClick={toggleTheme}
                        >
                            <span>
                                {isDarkMode ? <IoSunnySharp size={20} /> : <IoMoonSharp size={20} />}
                            </span>
                            <span>
                                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                            </span>
                        </button>
                        <button
                            className='w-full flex items-center gap-2 p-2 hover:bg-slate-300 rounded-md'
                            onClick={() => {
                                toggleModal()
                                setEditUserOpen(true)
                            }}
                        >
                            <span>
                                <HiOutlineDotsVertical size={20} />
                            </span>
                            <span>
                                Edit Profile
                            </span>
                        </button>
                    </div>
                    <div className='w-full h-full'>
                        <button
                            className='w-full flex items-center gap-2 p-2 hover:bg-slate-300 rounded-md'
                            onClick={() => {
                                toggleModal()
                                setOpenSearchUser(true)
                            }}
                        >
                            <span>
                                <TbUserPlus size={20} />
                            </span>
                            <span>
                                Add Friend
                            </span>
                        </button>
                        <button
                            className='w-full flex items-center gap-2 p-2 hover:bg-slate-300 rounded-md'
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
