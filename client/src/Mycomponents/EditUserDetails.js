import React, { useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { animated, useSpring, useTransition } from 'react-spring';

const EditUserDetails = ({ onClose, user }) => {
    const [data, setData] = useState({
        name: user?.name || '',
        profile_pic: user?.profile_pic || '',
    });

    const [isModalVisible, setModalVisible] = useState(true);
    const [isExiting, setExiting] = useState(false);

    const uploadPhotoRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            ...user
        }));
    }, [user]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenUploadPhoto = (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadPhotoRef.current.click();
    };

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const uploadPhoto = await uploadFile(file);
            setData((prev) => ({
                ...prev,
                profile_pic: uploadPhoto?.url || prev.profile_pic
            }));
        } catch (error) {
            toast.error('Failed to upload photo.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
            const response = await axios.post(URL, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                dispatch(setUser(response.data.data));
                toast.success(response.data.message);
                handleClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error?.response?.data?.message || 'Failed to update user details.');
        }
    };

    const handleClose = () => {
        setExiting(true);
        setTimeout(() => {
            setModalVisible(false);
            onClose();
        }, 300); // duration of the exit transition
    };

    const modalTransition = useTransition(isModalVisible || isExiting, {
        from: { opacity: 0, transform: 'scale(0.9)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.9)' },
        config: { duration: 300 }
    });

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

    return modalTransition((styles, item) =>
        item && (
            <animated.div style={styles} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <animated.div style={{ opacity: styles.opacity, transform: styles.transform }} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 sm:mx-0">
                    <div className='flex justify-between items-center'>
                        <h1 className='text-xl font-bold'>Edit User Details</h1>
                        <button onClick={handleClose}><IoCloseOutline size={25} /></button>
                    </div>
                    <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                        <div className='mt-4 flex justify-center items-center'>
                            <div className='my-1 flex items-center gap-4'>
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
                                Name:
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
                            <ButtonWithAnimation
                                onClick={handleClose}
                                className='bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2'
                            >
                                Cancel
                            </ButtonWithAnimation>
                            <ButtonWithAnimation
                                type='submit'
                                className='bg-primary text-white px-4 py-2 rounded-md'
                            >
                                Update
                            </ButtonWithAnimation>
                        </div>
                    </form>
                </animated.div>
            </animated.div>
        )
    );
};

export default React.memo(EditUserDetails);
