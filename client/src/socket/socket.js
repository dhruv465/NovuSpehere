// socket.js
import io from 'socket.io-client';

let socket;

export const initSocketConnection = (token) => {
  socket = io(process.env.REACT_APP_BACKEND_URL, {
    auth: {
      token
    }
  });

  return socket;
};

export const getSocket = () => socket;
