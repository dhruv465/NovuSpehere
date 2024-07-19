// Home.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setUser } from '../redux/userSlice';
import Sidebar from '../Mycomponents/Sidebar';
import logo from '../assets/logo.png';
import axios from 'axios';
import { initSocketConnection, getSocket } from '../socket/socket';

const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
      console.log("current user Details", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const socket = initSocketConnection(localStorage.getItem('token'));

    socket.on('onlineUser', (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const basePath = location.pathname === '/';
  return (
    <div className='grid lg:grid-cols-[500px,1fr] h-screen max-h-screen'>
      <section className={`shadow-2xl ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
        <div>
          <img src={logo} width={100} alt='logo' />
        </div>
        <p className='text-lg mt-2 text-slate-600'>Select a friend to chat with!!</p>
      </div>
    </div>
  );
};

export default Home;
