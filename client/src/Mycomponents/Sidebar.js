import { CheckIcon } from '@heroicons/react/24/solid'; // Ensure the correct path for v2
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { BsPeople, BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import { IoDocument, IoImages, IoLanguage, IoSearch, IoVideocam } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { animated, useSpring, useTransition } from 'react-spring';
import Avatar from '../Mycomponents/Avatar';
import { logout } from '../redux/userSlice';
import EditUserDetails from './EditUserDetails';
import SearchUser from './SearchUser';
import { IoIosArrowDown } from 'react-icons/io';


const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [allUser, setAllUser] = useState([])
    const [openSearchUser, setOpenSearchUser] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showHeaderMenu, setShowHeaderMenu] = useState(false);
    const [showApply, setShowApply] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const toggleLanguageModal = () => setShowModal(!showModal);
    const [selectedLanguages, setSelectedLanguages] = useState({});



    const languageMap = {
        fr: 'French',
        en: 'English',
        es: 'Spanish',
        de: 'German',
        hi: 'Hindi',
        mr: 'Marathi',
        ar: 'Arabic',
        bn: 'Bengali',
        pt: 'Portuguese',
        ru: 'Russian',
        ja: 'Japanese',
        de: 'German',
        zh: 'Chinese',
    };

    const [dataUser, setDataUser] = useState({
        name: "",
        email: "",
        profile_pic: "",
        online: false,
        _id: ""
    })
    const applyTransition = useTransition(showApply, {
        from: { opacity: 0, transform: 'translateY(20px)' },
        enter: { opacity: 1, transform: 'translateY(0)' },
        leave: { opacity: 0, transform: 'translateY(20px)' },
    });

    // Transition for the modal
    const modalTransition = useTransition(showModal, {
        from: { opacity: 0, transform: 'scale(0.9)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.9)' },
    });

    const handleCheckboxChange = (key) => {
        setSelectedLanguages(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        setShowApply(true);
    };

    const handleApply = async () => {
        const token = localStorage.getItem('token'); // Replace with how you store and retrieve the token

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                },
                body: JSON.stringify({
                    languages: Object.keys(selectedLanguages).filter(key => selectedLanguages[key]),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update preferences: ${errorData.message}`);
            }

            const updatedUser = await response.json();
            setDataUser(updatedUser); // Update local state with the updated user info
            setShowApply(false); // Close the apply button
            toggleLanguageModal(); // Close the modal
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/${dataUser?._id}`);
                if (!response.ok) throw new Error('Failed to fetch user data');
                const user = await response.json();
                setSelectedLanguages(user.languages.reduce((acc, lang) => ({ ...acc, [lang]: true }), {}));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (dataUser?._id) {
            fetchUserData();
        }
    }, [dataUser?._id]);

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

    const [hoverProps, setHover] = useSpring(() => ({
        transform: 'translateY(0px)',
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    }));

    const ButtonWithAnimation = ({ onClick, children, className }) => {
        return (
            <animated.button
                onClick={onClick}
                className={className}
                style={hoverProps}
                onMouseEnter={() => setHover({ transform: 'translateY(2px)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' })}
                onMouseLeave={() => setHover({ transform: 'translateY(0px)', boxShadow: '0 0 0 rgba(0, 0, 0, 0)' })}
            >
                {children}
            </animated.button>
        );
    };

    const handleReset = () => {
        resetUserPreferences();
    };

    const resetUserPreferences = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reset-preferences`, {}, config);
            console.log('Preferences reset successfully:', response.data);
        } catch (error) {
            console.error('Error resetting preferences:', error);
        }
    };
    return (
        <div className='w-full h-full backdrop-filter backdrop-blur-sm bg-white border-l-0 border-r  '>


            <div className='w-full col-start-2'>
                <div className='h-16 flex items-center justify-between pr-4 bg-transparent'>
                    <div className='flex justify-center items-center'>
                        <span className='ml-4'>                    <Avatar width={40} height={40} name={user?.name} imageUrl={user.profile_pic} userId={user?._id} />
                        </span>

                        <h2 className='text-2xl font-bold pl-4 text-black font-noto-sans'>
                            Messages
                        </h2>
                    </div>

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
                {/* Modal */}
                {modalTransition((styles, item) =>
                    item && (
                        <animated.div style={styles} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 sm:mx-0">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose receiver language</h2>
                                <ul className="space-y-2">
                                    {Object.entries(languageMap)
                                        .slice(0, 6) // Get the first 5 entries
                                        .map(([key, value]) => (
                                            <li
                                                key={key}
                                                className="flex items-center p-3 hover:bg-gray-100 rounded-md transition-colors duration-200 cursor-pointer"
                                                onClick={() => handleCheckboxChange(key)}
                                            >
                                                <div className="w-6 h-6 border-2 border-blue-500 rounded-md mr-3 flex items-center justify-center">
                                                    {selectedLanguages[key] && (
                                                        <CheckIcon className="w-4 h-4 text-blue-500" />
                                                    )}
                                                </div>
                                                <span className="text-lg text-gray-700">{value}</span>
                                            </li>
                                        ))}
                                </ul>

                                <div className="mt-6 flex gap-6">
                                    <ButtonWithAnimation
                                        onClick={() => {
                                            setShowApply(false);
                                            toggleLanguageModal();
                                        }}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        Cancel
                                    </ButtonWithAnimation>

                                    <ButtonWithAnimation
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                                        onClick={handleReset}
                                    >
                                        Reset
                                    </ButtonWithAnimation>

                                    {applyTransition((styles, item) =>
                                        item && (
                                            <ButtonWithAnimation
                                                onClick={handleApply}
                                                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                            >
                                                Apply
                                            </ButtonWithAnimation>
                                        )
                                    )}
                                </div>
                            </div>
                        </animated.div>
                    )
                )}

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
                                        <div className='ml-4 flex-1'>
                                            <div className='flex justify-between items-center'>
                                                <h2 className='text-lg font-semibold text-slate-800'>
                                                    {conv?.userDetails?.name}
                                                </h2>
                                                <span className='text-xs text-slate-500'>
                                                    {moment(conv?.lastMsg?.createdAt).format('hh:mm A')}
                                                </span>
                                            </div>
                                            <div className='flex justify-between items-center'>
                                                <div className='text-slate-500 text-md '>
                                                    {conv?.lastMsg?.imageUrl && (
                                                        <div className='flex items-center gap-2'>
                                                            <span>
                                                                <IoImages />
                                                            </span>
                                                            {!conv?.lastMsg?.text && (
                                                                <span>
                                                                    Image.
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {conv?.lastMsg?.videoUrl && (
                                                        <div className='flex items-center gap-2'>
                                                            <span>
                                                                <IoVideocam />
                                                            </span>
                                                            {!conv?.lastMsg?.text && (
                                                                <span>
                                                                    Video.
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {conv?.lastMsg?.documentUrl && (
                                                        <div className='flex items-center gap-2'>
                                                            <span>
                                                                <IoDocument />
                                                            </span>
                                                            {!conv?.lastMsg?.text && (
                                                                <span>
                                                                    Document.
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    <p className='text-ellipsis line-clamp-1 gap-4'>{conv?.lastMsg?.text}</p>
                                                </div>
                                                <IoIosArrowDown className='text-slate-500 text-xl mr-3' />
                                            </div>
                                        </div>
                                        {Boolean(conv?.unseenMsg) && (
                                            <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>
                                                {conv?.unseenMsg}
                                            </p>
                                        )}
                                    </div>
                                </NavLink>
                            )
                        })
                    }


                </div>
            </div>

            {/* Open Menu */}
            {isModalOpen && (
                <div className='absolute top-14 right-8 w-56 backdrop-filter backdrop-blur-lg p-3 shadow rounded-lg'>

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
                        <button
                            onClick={toggleLanguageModal}
                            className='w-full flex items-center gap-2 p-2 hover:bg-secondary rounded-md'
                        >
                            <span>
                                <IoLanguage size={24} />

                            </span>
                            <span>
                                Receive Messages In
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
